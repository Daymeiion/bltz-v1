import { PlayerMessageCenter } from "@/components/player/MessageCenter";

export const metadata = {
  title: "Messages | BLTZ Dashboard",
  description: "Your message center for communicating with admin",
};

export default function PlayerMessagesPage() {
  return (
    <div className="p-3 md:p-8 max-w-[1600px] mx-auto">
      <PlayerMessageCenter />
    </div>
  );
}
