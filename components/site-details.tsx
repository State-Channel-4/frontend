import { C4Content } from "@/types";
import moment from 'moment';

interface SiteDetailsProps {
    currentSite: C4Content;
    open: boolean;
    onClose: () => void;
}

export default function SiteDetails({currentSite, open, onClose}: SiteDetailsProps) {
    console.log('Current site: ', currentSite);
    return <div className="absolute w-full max-w-[1112px] transition-all duration-300 p-10 bg-shark-950 border border-shark-500 rounded-2xl sm:bottom-[calc(100%+12px)] sm:left-12" style={{
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transform: open ? "translateY(0px)" : "translateY(45px)",
      }}>
        <div>
            <div className="text-2xl">{currentSite.title}</div>
            <div className="mt-8 flex gap-2 items-center text-sm">
                <div>Submitted by</div>
                <div className="bg-[#374052] py-1 px-2 rounded-lg">~{currentSite.submittedBy}</div>
                <div>on {moment(currentSite.createdAt).format('DD MMM YYYY')}</div>
            </div>
        </div>
        <div>
        </div>
      </div>
}