import {useEffect, useState} from "react";

interface Location {
    latitude: number | null;
    longitude: number | null;
}

export default function useUserLocation(enabled: boolean) {
    const [location, setLocation] = useState<Location>({
        // 사용자가 위치 정보 수집 거부 시, 기본 값 서울로 설정
        latitude: 37.6, longitude: 127
    });

    useEffect(() => {
        // 로그인이나 동의를 안 했을 시 위치 요청 안 함
        if(!enabled) return;

        navigator.geolocation.getCurrentPosition((pos) => {
            setLocation({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
            });
        },
            ()=>{}
        );
    }, [enabled]);

    return location;
}