import React from 'react';
import SemesterList from '../components/semesters/SemesterList';
import Breadcrumb from '../components/layout/Breadcrumb';

const SemestersPage: React.FC = () => {
  return (
    <div>
      <Breadcrumb />
      <SemesterList />
    </div>
  );
};

export default SemestersPage;