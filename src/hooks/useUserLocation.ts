import {useEffect, useState} from "react";

interface Location {
    latitude: number | null;
    longitude: number | null;
}

export default function useUserLocation() {
    const [location, setLocation] = useState<Location>({
        // 사용자가 위치 정보 수집 거부 시, 기본 값 서울로 설정
        latitude: 37.6, longitude: 127
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setLocation({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
            })
        })
    }, []);

    return location;
}