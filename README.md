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

https://velog.io/@intellik/NestJS-효과적인-예외-핸들링
https://cheese10yun.github.io/spring-guide-exception/

## TODO

1. Refresh Token 테이블 생성 ㅇㅇ
2. Sign in시에 access token, refresh token을 쿠키에 저장 ㅇㅇ
3. Auth Guard 추가
4. 재발급 시나리오 추가
   4-1. access token 만료, refresh token 유효
   4-2. access token 만료, refresh token 만료
   4-3. access token 유효, refresh token 만료
   4-4. access token 유효, refresh token 유효
