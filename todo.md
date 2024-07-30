룬 / 스탯 남음 + 스펠

룬 entity 필요
스탯은 3가지 별로 저장

entity 총 두개 필요

"summoner1Id": 12, // 스펠
"summoner2Casts": 5,
"summoner2Id": 4, // 스펠

스탯 entity -> offense,defense,flex
메인 룬 entity ->
보조 룬 entity ->
스펠 entity id, name -> champion_id , spell_id

summonerId 배열, 카운트 캐싱

summonerIds summoner array
summonerCountAndLength summoner 카운트 및 길이
503 에러코드 올때 일정 시간 후 재요청 보내는 로직

match들 반복 => ㅇㅇㅇㅇㅇ????

중간중간 키값이랑 제대로 가지만 404 에러가 나오는 경우가 있음. => 404 에러시 다음꺼 진행하게 해야할듯
