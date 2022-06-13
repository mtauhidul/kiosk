import React from 'react';

const Selected = ({ headerText, items }) => {
  return (
    <div>
      <h3 className='header3'>{headerText}</h3>
      <br />
      {items.map((item, index) => {
        return (
          <h5 style={{ marginBottom: '20px' }} key={index} className='header5'>
            {item}
          </h5>
        );
      })}
    </div>
  );
};

export default Selected;
