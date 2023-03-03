import React from 'react';
import './FolderList.scss';
import SolidIcon from '../Icon/solidIcons/index';
function FolderList({
  className,
  backgroundColor,
  disabled,
  RightIcon,
  LeftIcon,
  children,
  onClick,
  selectedItem,
  ...restProps
}) {
  console.log('folder list props', children);
  return (
    <button
      {...restProps}
      className={`tj-list-item ${selectedItem == children && 'tj-list-item-selected'}  ${className} ${
        disabled && `tj-list-item-disabled`
      }`}
      style={backgroundColor && { backgroundColor }}
      onClick={onClick}
    >
      <div>
        {LeftIcon && (
          <div className="tj-list-item-icon">
            <SolidIcon name={LeftIcon} />
          </div>
        )}
        {children}
      </div>

      {RightIcon && <div className="tj-list-item-icon">{RightIcon && <SolidIcon name={RightIcon} />}</div>}
    </button>
  );
}

export default FolderList;
