
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
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 pt-6 sm:pt-8 text-xs sm:text-sm text-gray-300">
            <p className="hidden sm:block">{t('showing')} {pagination.pageSize} {t('of')} {pagination.totalItems}</p>
            <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-3 sm:gap-6 w-full sm:w-auto">
                <div className="flex justify-start items-center gap-2">
                    <p className="text-xs sm:text-sm">{t('items')}</p>
                    <Select onValueChange={(value) => handlePageSizeChange(Number(value))} defaultValue={pagination.pageSize.toString()}>
                        <SelectTrigger className="w-[60px] sm:w-[70px] h-8 text-xs sm:text-sm">
                            <SelectValue placeholder={pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent>
                            {pageSizes.map((size, index) => (
                                <SelectItem key={index} value={size.toString()} className="text-xs sm:text-sm">{size}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <p className="text-xs sm:text-sm">{t('page')} {pagination.currentPage} {t('of')} {pagination.pages}</p>
                <div className="flex justify-start items-center gap-0.5">
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hidden sm:flex" disabled={pagination.currentPage === 1} onClick={() => handlePageChange(1)}>
                        <FiChevronsLeft className="w-5 h-5 sm:w-8 sm:h-8"/>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" disabled={pagination.currentPage === 1} onClick={() => handlePageChange(pagination.currentPage - 1)}>
                        <FiChevronLeft className="w-5 h-5 sm:w-8 sm:h-8"/>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" disabled={pagination.currentPage === pagination.pages} onClick={() => handlePageChange(pagination.currentPage + 1)}>
                        <FiChevronRight className="w-5 h-5 sm:w-8 sm:h-8"/>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hidden sm:flex" disabled={pagination.currentPage === pagination.pages} onClick={() => handlePageChange(pagination.pages)}>
                        <FiChevronsRight className="w-5 h-5 sm:w-8 sm:h-8"/>
                    </Button>
                </div>
            </div>
        </div>
    )
}