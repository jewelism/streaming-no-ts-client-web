import React from 'react';
import { IMember } from '../types';

function Members({ members }: { members: IMember[] }) {
  return (
    <div>members => {members.map(({ nickname }) => nickname).join(', ')}</div>
  );
}

export default Members;