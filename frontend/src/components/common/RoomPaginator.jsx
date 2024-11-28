import React from 'react';
import ReactPaginate from 'react-paginate';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const RoomPagination = ({ pageCount, currentPage, onPageChange }) => (
  <ReactPaginate
    previousLabel={<ArrowLeft className="w-5 h-5" />}
    nextLabel={<ArrowRight className="w-5 h-5" />}
    pageCount={pageCount}
    onPageChange={onPageChange}
    forcePage={currentPage - 1}
    className="flex list-none items-center justify-center gap-2"
    pageClassName="page-item"
    pageLinkClassName="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 text-gray-700 transition-colors duration-200"
    previousClassName="page-item"
    previousLinkClassName="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors duration-200 hover:scale-110"
    nextClassName="page-item"
    nextLinkClassName="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors duration-200 hover:scale-110"
    breakLabel="..."
    breakClassName="page-item"
    breakLinkClassName="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-gray-700"
    containerClassName="pagination"
    activeClassName="bg-blue-200 !text-white hover:!bg-blue-600"
    renderOnZeroPageCount={null}
  />
);

export default RoomPagination;