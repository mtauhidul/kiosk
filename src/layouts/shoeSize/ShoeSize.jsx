import { FormControl, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import Bottom from '../../components/Bottom/Bottom';
import * as actionCreators from '../../state/actionCreators/index';
import store from '../../state/store';
import styles from '../../styles/ShoeSize.module.css';
import { sizeList } from './size';

function valuetext(value) {
  return `${value}°C`;
}

export default function ShoeSize() {
  const dispatch = useDispatch();
  const { addShoeSize } = bindActionCreators(actionCreators, dispatch);
  const [data, setData] = React.useState({
    shoeSize: '5',
  });

  React.useEffect(() => {
    const state = store?.getState()?.data?.shoeSize;
    setData(state);
  }, []);

  return (
    <div className={styles.shoeSizeContainer}>
      <div>
        <h3 className='header3'>CHOOSE YOUR SHOE SIZE</h3>
        <br />
        <Box className={styles.ranger} sx={{ width: '100%' }}>
          <Slider
            aria-label='Always visible'
            value={data.shoeSize}
            getAriaValueText={valuetext}
            step={0.5}
            marks={sizeList}
            valueLabelDisplay='on'
            min={4}
            max={13}
            onChange={(e) => setData({ shoeSize: e.target.value })}
          />
        </Box>
        <Box className={styles.manualInput} sx={{ width: '100%', p: '20px' }}>
          <h6 className='header6'>or enter manually</h6>
          <FormControl sx={{ mb: 3, mt: 1, minWidth: '35%' }}>
            <TextField
              id='outlined-required'
              label='Enter shoe size here'
              onChange={(e) => setData({ shoeSize: e.target.value })}
            />
          </FormControl>
        </Box>
      </div>
      <Bottom handleSubmit={addShoeSize} data={data} />
    </div>
  );
}
