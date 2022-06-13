import React from 'react';
import styles from '../../styles/Option.module.css';

const Option = ({ addedItems, handleAdd, option }) => {
  console.log(addedItems);
  const checkOptionState =
    addedItems && addedItems?.find((item) => item === option);
  return (
    <label className={styles.customOption}>
      {checkOptionState ? (
        <input onClick={() => handleAdd(option)} type='checkbox' checked />
      ) : (
        <input onClick={() => handleAdd(option)} type='checkbox' />
      )}

      <span>{option}</span>
    </label>
  );
};

export default Option;
