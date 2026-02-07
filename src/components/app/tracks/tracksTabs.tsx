import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import TracksList from "./tracksList";

export default function TracksTabs() {
    const t = useTranslations('app.home.userStats.tracks');
    return (
        <Tabs defaultValue="saved_tracks" className="w-full">
            <TabsList className="w-full grid grid-cols-2 h-auto gap-1 bg-transparent p-0 sm:bg-slate-200 sm:dark:bg-gray sm:p-1 sm:flex mb-4 sm:mb-0">
                <TabsTrigger value="saved_tracks" className="w-full sm:w-1/4 h-12 sm:h-9 bg-slate-200 dark:bg-gray sm:bg-transparent sm:dark:bg-transparent data-[state=active]:bg-slate-300 dark:data-[state=active]:bg-gray-foreground whitespace-normal text-xs sm:text-sm leading-tight px-1">{t('tabs.liked')}</TabsTrigger>
                <TabsTrigger value="top_tracks_last_month" className="w-full sm:w-1/4 h-12 sm:h-9 bg-slate-200 dark:bg-gray sm:bg-transparent sm:dark:bg-transparent data-[state=active]:bg-slate-300 dark:data-[state=active]:bg-gray-foreground whitespace-normal text-xs sm:text-sm leading-tight px-1">{t('tabs.top_last_month')}</TabsTrigger>
                <TabsTrigger value="top_tracks_six_months" className="w-full sm:w-1/4 h-12 sm:h-9 bg-slate-200 dark:bg-gray sm:bg-transparent sm:dark:bg-transparent data-[state=active]:bg-slate-300 dark:data-[state=active]:bg-gray-foreground whitespace-normal text-xs sm:text-sm leading-tight px-1">{t('tabs.top_last_six_months')}</TabsTrigger>
                <TabsTrigger value="top_tracks_all_time" className="w-full sm:w-1/4 h-12 sm:h-9 bg-slate-200 dark:bg-gray sm:bg-transparent sm:dark:bg-transparent data-[state=active]:bg-slate-300 dark:data-[state=active]:bg-gray-foreground whitespace-normal text-xs sm:text-sm leading-tight px-1">{t('tabs.top_all_times')}</TabsTrigger>
            </TabsList>
            <TabsContent value="saved_tracks">
                <TracksList listType="liked" />
            </TabsContent>
            <TabsContent value="top_tracks_last_month">
                <TracksList listType="top_last_month" />
            </TabsContent>
            <TabsContent value="top_tracks_six_months">
                <TracksList listType="top_six_months" />
            </TabsContent>
            <TabsContent value="top_tracks_all_time">
                <TracksList listType="top_all_time" />
            </TabsContent>
        </Tabs>
    )
}