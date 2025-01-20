
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { PaginationProps } from "@/types/ui/pagination";
import { useTranslations } from "next-intl";

interface PaginationComponentProps {
    pagination: PaginationProps;
    setPagination: React.Dispatch<React.SetStateAction<PaginationProps>>;
}

export default function Pagination({pagination, setPagination}: PaginationComponentProps){
    const t = useTranslations('ui.pagination');

    function handlePageSizeChange(size: number){
        setPagination({
            ...pagination,
            pageSize: size,
            pages: Math.ceil(pagination.totalItems / size)
        });
    }

    function handlePageChange(page: number){
        setPagination({
            ...pagination,
            currentPage: page,
            offset: (page - 1) * pagination.pageSize
        });
    }
    
    const pageSizes = [10, 20, 30, 50];
    
    return(
        <div className="w-full flex justify-between items-center pt-8 text-sm text-gray-300">
            <p>{t('showing')} {pagination.pageSize} {t('of')} {pagination.totalItems}</p>
            <div className="flex justify-start items-center gap-6">
                <div className="flex justify-start items-center gap-2">
                    <p>{t('items')}</p>
                    <Select onValueChange={(value) => handlePageSizeChange(Number(value))} defaultValue={pagination.pageSize.toString()}>
                        <SelectTrigger className="w-[70px]">
                            <SelectValue placeholder={pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent>
                            {pageSizes.map((size, index) => (
                                <SelectItem key={index} value={size.toString()}>{size}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <p>{t('page')} {pagination.currentPage} {t('of')} {pagination.pages}</p>
                <div className="flex justify-start items-center gap-0.5">
                    <Button variant="ghost" size="icon" disabled={pagination.currentPage === 1} onClick={() => handlePageChange(1)}>
                        <FiChevronsLeft className="w-8 h-8"/>
                    </Button>
                    <Button variant="ghost" size="icon" disabled={pagination.currentPage === 1} onClick={() => handlePageChange(pagination.currentPage - 1)}>
                        <FiChevronLeft className="w-8 h-8"/>
                    </Button>
                    <Button variant="ghost" size="icon" disabled={pagination.currentPage === pagination.pages} onClick={() => handlePageChange(pagination.currentPage + 1)}>
                        <FiChevronRight className="w-8 h-8"/>
                    </Button>
                    <Button variant="ghost" size="icon" disabled={pagination.currentPage === pagination.pages} onClick={() => handlePageChange(pagination.pages)}>
                        <FiChevronsRight className="w-8 h-8"/>
                    </Button>
                </div>
            </div>
        </div>
    )
}