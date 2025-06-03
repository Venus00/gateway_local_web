import React from "react";
import Pagination from "../pagination";

import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
export type PaginationProps = { page: number; perPage: number };

interface PropsType {
  color: string;
  total: number;
  paginationParams: PaginationProps;
  setPaginationParams: (args: PaginationProps) => void;
}

export default function ParamsPagination({
  color,
  total,
  paginationParams,
  setPaginationParams,
}: PropsType) {
  const changePage = ({ page, perPage }: { page: number; perPage: number }) => {
    setPaginationParams({ page, perPage });
  };

  return (
    <Pagination
      color={color}
      total={total}
      value={{
        page: paginationParams.page,
        perPage: paginationParams.perPage,
      }}
      onChange={changePage}
    />
  );
}
