import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";

export default function TracksTabs() {
    const t = useTranslations('app.home.userStats.tracks');
    return (
        <Tabs defaultValue="saved_tracks" className="w-full">
            <TabsList className="w-full">
                <TabsTrigger value="saved_tracks" className="w-1/4">{t('tabs.liked')}</TabsTrigger>
                <TabsTrigger value="top_tracks_last_month" className="w-1/4">{t('tabs.top_last_month')}</TabsTrigger>
                <TabsTrigger value="top_tracks_six_months" className="w-1/4">{t('tabs.top_last_six_months')}</TabsTrigger>
                <TabsTrigger value="top_tracks_all_time" className="w-1/4">{t('tabs.top_all_times')}</TabsTrigger>
            </TabsList>
        </Tabs>
    )
}