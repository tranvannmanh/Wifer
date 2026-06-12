package com.wifer

import android.annotation.SuppressLint
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import android.net.wifi.ScanResult
import android.net.wifi.WifiConfiguration
import android.net.wifi.WifiManager
import android.net.wifi.WifiNetworkSpecifier
import android.os.Build
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableArray
import com.facebook.react.module.annotations.ReactModule
import com.nativewifimanager.NativeWifiManagerSpec

@ReactModule(name = NativeWifiManagerModule.NAME)
@SuppressLint("MissingPermission")
class NativeWifiManagerModule(reactContext: ReactApplicationContext) :
    NativeWifiManagerSpec(reactContext) {

    companion object {
        const val NAME = "NativeWifiManager"
    }

    private val wifiManager: WifiManager
        get() = reactApplicationContext.applicationContext
            .getSystemService(Context.WIFI_SERVICE) as WifiManager

    private val connectivityManager: ConnectivityManager
        get() = reactApplicationContext.applicationContext
            .getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

    private var networkCallback: ConnectivityManager.NetworkCallback? = null

    override fun getName() = NAME

    override fun isEnabled(promise: Promise) {
        try {
            promise.resolve(wifiManager.isWifiEnabled)
        } catch (e: Exception) {
            promise.reject("WIFI_ERROR", e.message ?: "Unknown error")
        }
    }

    override fun setEnabled(enabled: Boolean, promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                // Android 10+: programmatic toggle is not allowed; open the WiFi settings panel
                val intent = Intent(android.provider.Settings.Panel.ACTION_WIFI).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                }
                reactApplicationContext.startActivity(intent)
            } else {
                @Suppress("DEPRECATION")
                wifiManager.isWifiEnabled = enabled
            }
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("WIFI_ERROR", e.message ?: "Unknown error")
        }
    }

    override fun loadWifiList(promise: Promise) {
        try {
            promise.resolve(buildWifiArray(wifiManager.scanResults))
        } catch (e: Exception) {
            promise.reject("WIFI_SCAN_ERROR", e.message ?: "Unknown error")
        }
    }

    @Suppress("DEPRECATION")
    override fun reScanAndLoadWifiList(promise: Promise) {
        val receiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context, intent: Intent) {
                reactApplicationContext.unregisterReceiver(this)
                try {
                    promise.resolve(buildWifiArray(wifiManager.scanResults))
                } catch (e: Exception) {
                    promise.reject("WIFI_SCAN_ERROR", e.message ?: "Unknown error")
                }
            }
        }
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                reactApplicationContext.registerReceiver(
                    receiver,
                    IntentFilter(WifiManager.SCAN_RESULTS_AVAILABLE_ACTION),
                    Context.RECEIVER_NOT_EXPORTED,
                )
            } else {
                reactApplicationContext.registerReceiver(
                    receiver,
                    IntentFilter(WifiManager.SCAN_RESULTS_AVAILABLE_ACTION),
                )
            }
            val started = wifiManager.startScan()
            if (!started) {
                // Scan throttled; return cached results immediately
                reactApplicationContext.unregisterReceiver(receiver)
                promise.resolve(buildWifiArray(wifiManager.scanResults))
            }
        } catch (e: Exception) {
            try { reactApplicationContext.unregisterReceiver(receiver) } catch (_: Exception) {}
            promise.reject("WIFI_SCAN_ERROR", e.message ?: "Unknown error")
        }
    }

    override fun getCurrentWifiSSID(promise: Promise) {
        try {
            val ssid = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val network = connectivityManager.activeNetwork
                val caps = connectivityManager.getNetworkCapabilities(network)
                val wifiInfo = caps?.transportInfo as? android.net.wifi.WifiInfo
                wifiInfo?.ssid?.removeSurrounding("\"") ?: ""
            } else {
                @Suppress("DEPRECATION")
                wifiManager.connectionInfo?.ssid?.removeSurrounding("\"") ?: ""
            }
            promise.resolve(ssid)
        } catch (e: Exception) {
            promise.reject("WIFI_ERROR", e.message ?: "Unknown error")
        }
    }

    override fun connectToProtectedSSID(
        ssid: String,
        password: String,
        isWEP: Boolean,
        promise: Promise,
    ) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                connectNewArch(ssid, password, promise)
            } else {
                connectLegacy(ssid, password, isWEP, promise)
            }
        } catch (e: Exception) {
            promise.reject("WIFI_CONNECT_ERROR", e.message ?: "Unknown error")
        }
    }

    private fun connectNewArch(ssid: String, password: String, promise: Promise) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) return

        networkCallback?.let {
            try { connectivityManager.unregisterNetworkCallback(it) } catch (_: Exception) {}
        }

        val specifier = WifiNetworkSpecifier.Builder()
            .setSsid(ssid)
            .apply { if (password.isNotEmpty()) setWpa2Passphrase(password) }
            .build()

        val request = NetworkRequest.Builder()
            .addTransportType(NetworkCapabilities.TRANSPORT_WIFI)
            .removeCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
            .setNetworkSpecifier(specifier)
            .build()

        val callback = object : ConnectivityManager.NetworkCallback() {
            override fun onAvailable(network: Network) {
                connectivityManager.bindProcessToNetwork(network)
                promise.resolve(null)
            }
            override fun onUnavailable() {
                promise.reject("WIFI_CONNECT_ERROR", "Network unavailable or connection timed out")
            }
        }
        networkCallback = callback
        connectivityManager.requestNetwork(request, callback, 30_000)
    }

    @Suppress("DEPRECATION")
    private fun connectLegacy(ssid: String, password: String, isWEP: Boolean, promise: Promise) {
        val config = WifiConfiguration().apply {
            SSID = "\"$ssid\""
            when {
                password.isEmpty() -> allowedKeyManagement.set(WifiConfiguration.KeyMgmt.NONE)
                isWEP -> {
                    wepKeys[0] = "\"$password\""
                    wepTxKeyIndex = 0
                    allowedKeyManagement.set(WifiConfiguration.KeyMgmt.NONE)
                    allowedGroupCiphers.set(WifiConfiguration.GroupCipher.WEP40)
                }
                else -> preSharedKey = "\"$password\""
            }
        }
        val networkId = wifiManager.addNetwork(config)
        if (networkId == -1) {
            promise.reject("WIFI_CONNECT_ERROR", "Failed to add network configuration")
            return
        }
        wifiManager.disconnect()
        wifiManager.enableNetwork(networkId, true)
        wifiManager.reconnect()
        promise.resolve(null)
    }

    override fun disconnect(promise: Promise) {
        try {
            networkCallback?.let {
                try { connectivityManager.unregisterNetworkCallback(it) } catch (_: Exception) {}
                networkCallback = null
            }
            connectivityManager.bindProcessToNetwork(null)
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
                @Suppress("DEPRECATION")
                promise.resolve(wifiManager.disconnect())
            } else {
                promise.resolve(true)
            }
        } catch (e: Exception) {
            promise.reject("WIFI_ERROR", e.message ?: "Unknown error")
        }
    }

    private fun buildWifiArray(results: List<ScanResult>): WritableArray =
        Arguments.createArray().apply {
            results.forEach { r ->
                pushMap(Arguments.createMap().apply {
                    @Suppress("DEPRECATION")
                    putString("SSID", r.SSID ?: "")
                    putString("BSSID", r.BSSID ?: "")
                    putString("capabilities", r.capabilities ?: "")
                    putInt("frequency", r.frequency)
                    putInt("level", r.level)
                })
            }
        }
}
