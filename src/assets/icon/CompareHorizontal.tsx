import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {IconProps} from './interface';

export function CompareHorizontalIcon(props: IconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M9 14H2v2h7v3l4-4-4-4v3zm6-1v-3h7V8h-7V5l-4 4 4 4z"
        fill={props.color || '#000'}
      />
    </Svg>
  );
}
