# Backend Practice

## 1. Skill Stacks

- Typescript
- Nest.JS
- TypeORM (MySQL, I write raw SQL query to practice sql query)
- Jest
- Docker ( Soon )
- Github Actions ( Soon )

## 2. Entities

    User,
        Create,
        Read,
        Update,
        Delete,
    Post,

참고
https://github.com/jojoldu/monorepo-nestjs-typeorm/blob/master/apps/api/src/user/dto/UserSignupReq.ts
https://jojoldu.tistory.com/610

에러 핸들링
https://velog.io/@intellik/NestJS-효과적인-예외-핸들링
https://cheese10yun.github.io/spring-guide-exception/

JWT 토큰 다루기
https://www.reddit.com/r/reactjs/comments/14r0s8q/when_accesstoken_is_expired_for_jwt_authenication/
https://inpa.tistory.com/entry/WEB-📚-Access-Token-Refresh-Token-원리-feat-JWT#access_/_refresh_token_재발급_원리

## 설계한 JWT 토큰 핸들링 방법

### API 요청시

1. API요청시 Guard에서 Access Token을 검증한다.
2. Access Token이 유효하다면, API를 실행한다.
3. Access Token이 만료되었을 경우, 토큰 만료 에러를 던진다.
   2-1. Filter 또는 Intercepter에서 토큰 만료 에러를 처리한다.
   2-2. Refresh 토큰을 확인하여 Refresh 토큰이 유효하다면 Access Token을 재발급한다.
   2-2. Refresh 토큰이 만료되었을 경우, 클라이언트를 로그아웃 시킨다.
4. Access Token이 유효하지 않을 경우, 클라이언트를 로그아웃 시킨다.

### 토큰 Refresh 과정

1. 토큰 만료 에러를 받은 클라이언트는 Access Token과 Refresh Token을 가지고 토큰 재발급 요청을 한다.
2. /auth/refresh로 API 요청을 한다.
3. 토큰 검증 로직 실행
   3-1. access token 만료, refresh token 유효 -> ACCESS TOKEN 재발급
   3-2. access token 만료, refresh token 만료 -> 로그아웃
   3-3. access token 유효, refresh token 만료 -> 로그아웃
