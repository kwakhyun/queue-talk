## QueueTalk - 실시간 채팅 서비스
![화면 캡처 2022-09-30 173321](https://user-images.githubusercontent.com/73919235/193351203-bb5cbc68-12ff-4ad0-a134-0edb1cc6b558.jpg)

### 프로젝트 소개
- 그룹 및 1:1 채팅 앱 프로젝트입니다.
- 채팅 기능 구현에 Socket.IO 라이브러리를 채택했습니다.
- SWR 라이브러리를 사용해 컴포넌트 단위로 서버 데이터를 관리했습니다.
- API 서버는 Node.js Express, DB는 MySQL을 사용했습니다.

### 주요 기능
- 쿠키와 세션을 이용한 로그인
- 그라바타를 이용한 프로필 이미지 랜덤 설정
- Socket.IO를 이용한 채팅방 생성, 사용자 초대, 채팅 기능
- react-metions를 이용한 채팅방 사용자 멘션 기능
- SWR의 useSWRInfinite를 이용한 이전 채팅 내용 불러오기
- 채팅 내용 날짜별 섹션 구분
- Drag and Drop으로 이미지 업로드

### 사용 스택
`TypeScript` `React` `SWR` `Emotion` `Socket.IO` `Node.js` `Express` `MySQL`

### 시연 영상
https://user-images.githubusercontent.com/73919235/197386880-e494a3a6-9523-4c34-bb0d-b1641b08506a.mp4

