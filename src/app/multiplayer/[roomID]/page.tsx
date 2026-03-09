'use client';

import { useParams } from 'next/navigation';
import MultiplayerModule from '@/components/Multiplayer/MultiplayerModule';

export default function MultiplayerRoomPage() {
    const params = useParams();
    const roomID = params.roomID as string;

    return <MultiplayerModule initialRoomID={roomID} />;
}
