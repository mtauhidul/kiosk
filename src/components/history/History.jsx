/* eslint-disable no-lone-blocks */
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import Option from "../../components/option/Option";
import styles from "../../styles/History.module.css";

const History = ({ addedItems, addToList, items, headerText, btnText }) => {
  const [list, setList] = useState(items);
  const [showInput, setShowInput] = useState(false);

  return (
    <div className={styles.itemsContainer}>
      <h3 className="header3">{headerText}</h3>
      <br />
      <div className={styles.itemList}>
        {list.map((item, index) => {
          return (
            <Option
              addedItems={addedItems}
              handleAdd={addToList}
              option={item}
              key={index}
            />
          );
        })}
        {showInput && (
          <div className={styles.addNewInput}>
            <TextField
              onBlur={(e) => {
                {
                  e.target.value !== "" && setList([...list, e.target.value]);
                }
                setShowInput(false);
                addedItems && addToList(e.target.value);
              }}
              label="Add"
              id="outlined-size-small"
              size="small"
            />
          </div>
        )}
        <Button
          onClick={() => setShowInput(true)}
          sx={{ height: 46 }}
          className="backButton"
          variant="text"
          startIcon={<AddOutlinedIcon />}
        >
          {btnText}
        </Button>
      </div>
    </div>
  );
};

export default History;
