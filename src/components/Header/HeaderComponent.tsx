import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectGremlin,
} from '../../reducers/gremlinReducer';

export const HeaderComponent = ({}) => {
  const { error } = useSelector(selectGremlin);

  return (
    <div className={'header'}>
      <div style={{ color: 'red' }}>{error}</div>
    </div>
  );
};
