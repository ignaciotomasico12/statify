import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArtistsList from "./artistsList";
import { useTranslations } from "next-intl";

export default function ArtistsTabs() {
    const t = useTranslations('app.home.userStats.artists');
    return (
        <Tabs defaultValue="followed_artists" className="w-full">
            <TabsList className="w-full">
                <TabsTrigger value="followed_artists" className="w-1/4">{t('tabs.followed')}</TabsTrigger>
                <TabsTrigger value="top_artists_last_month" className="w-1/4">{t('tabs.top_last_month')}</TabsTrigger>
                <TabsTrigger value="top_artists_six_months" className="w-1/4">{t('tabs.top_last_six_months')}</TabsTrigger>
                <TabsTrigger value="top_artists_all_time" className="w-1/4">{t('tabs.top_all_times')}</TabsTrigger>
            </TabsList>
            <TabsContent value="followed_artists">
                <ArtistsList listType="followed"/>
            </TabsContent>
            <TabsContent value="top_artists_last_month">
                <ArtistsList listType="top_last_month"/>
            </TabsContent>
            <TabsContent value="top_artists_six_months">
                <ArtistsList listType="top_six_months"/>
            </TabsContent>
            <TabsContent value="top_artists_all_time">
                <ArtistsList listType="top_all_time"/>
            </TabsContent>
        </Tabs>
    )
}