"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RefObject, useEffect } from "react";

type ScrollableElement = {
    scrollIntoView: (props?: any) => void;
};

type PaginationProps<T extends ScrollableElement> = {
    className?: string, 
    totalPages: number, 
    currentPage: number, 
    onPageChange: (pageNumber: number) => void,
} & ( | { scrollToTheTop: true, containerRef: RefObject<T>} | { scrollToTheTop: false})

const Pagination = <T extends ScrollableElement>(props: PaginationProps<T>) => {

    const handlePageChange = (page: number) => {
        props.onPageChange(page)
        scrollToTop()
    }

    const scrollToTop = () => {
        if(props.scrollToTheTop && props.containerRef?.current){
            props.containerRef.current.scrollIntoView();
        }
    };

    useEffect(() => {
        scrollToTop()
    }, [props.currentPage])

    return (
        <div className={cn("w-full h-fit flex gap-2 justify-center items-center", props.className)}>
            <Button 
                className="flex gap-1.5 items-center max-[568px]:hidden" 
                variant="ghost" 
                onClick={() => props.currentPage - 1 > 0 && handlePageChange(props.currentPage - 1)}
                disabled={props.currentPage <= 1}
                aria-label="Previous page"
            >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
            </Button>
            <Button variant={props.currentPage == 1 ? "outline" : "ghost"} onClick={() => handlePageChange(1)}>1</Button>
            {props.currentPage - 2 > 2 && (
                <Button className="max-[664px]:hidden" variant="ghost" disabled aria-hidden="true">...</Button>
            )}
            {props.currentPage - 1 > 1 && (
                <Button className="px-0 min-[665px]:hidden" variant="ghost" disabled aria-hidden="true">...</Button>
            )}
            {props.currentPage - 2 > 1 && (
                <Button className="max-[664px]:hidden" variant="ghost" onClick={() => handlePageChange(props.currentPage - 2)}>{props.currentPage - 2}</Button>
            )}
            {props.currentPage - 1 > 1 && (
                <Button variant="ghost" onClick={() => handlePageChange(props.currentPage - 1)}>{props.currentPage - 1}</Button>
            )}
            {props.currentPage != 1 && props.currentPage != props.totalPages && (
                <Button variant="outline" onClick={() => handlePageChange(props.currentPage)}>{props.currentPage}</Button>
            )}
            {props.currentPage + 1 < props.totalPages && (
                <Button variant="ghost" onClick={() => handlePageChange(props.currentPage + 1)}>{props.currentPage + 1}</Button>
            )}
            {props.currentPage + 2 < props.totalPages && (
                <Button className="max-[664px]:hidden" variant="ghost" onClick={() => handlePageChange(props.currentPage + 2)}>{props.currentPage + 2}</Button>
            )}
            {props.currentPage + 1 < props.totalPages && (
                <Button className="px-0 min-[665px]:hidden" variant="ghost" disabled aria-hidden="true">...</Button>
            )}
            {props.currentPage + 2 < props.totalPages - 1 && (
                <Button className="max-[664px]:hidden"  variant="ghost" disabled aria-hidden="true">...</Button>
            )}
            <Button variant={props.currentPage == props.totalPages ? "outline" : "ghost"} onClick={() => handlePageChange(props.totalPages)}>{props.totalPages}</Button>
            <Button 
                className="flex gap-1.5 items-center max-[568px]:hidden" 
                variant="ghost" 
                onClick={() => props.currentPage + 1 <= props.totalPages && handlePageChange(props.currentPage + 1)}
                disabled={props.currentPage >= props.totalPages}
                aria-label="Next page"
            >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
}

export default Pagination;