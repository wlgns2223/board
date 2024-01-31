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

1. UnauthorizedException 에러코드 작성 ㅇㅇ
2. Auth Service Password Compare 로직 -> User Entity가 책임을 지도록 ㅇㅇ
3. password compare후 에러를 던지거나 토큰을 발급하거나 ㅇㅇ
4. 위 내용에 대한 포스트맨 테스트 ㅇㅇ
5. 테스트 코드 작성
