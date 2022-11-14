import React from 'react';
import './Style/ToolbarButton.css';

export default function ToolbarButton(props) {
    const { icon } = props;
    return (
      <i className={`toolbar-button ${icon}`} />
    );
}