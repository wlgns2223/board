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

## TODO

1. Refresh Token 테이블 생성 ㅇㅇ
2. Sign in시에 access token, refresh token을 쿠키에 저장 ㅇㅇ
3. Auth Guard 추가
4. Token Verificiation API 추가
   4-1. access token 만료, refresh token 유효 -> ACCESS TOKEN 재발급
   4-2. access token 만료, refresh token 만료 -> 로그아웃
   4-3. access token 유효, refresh token 만료 -> REFRESH TOKEN 재발급
   4-4. access token 유효, refresh token 유효 -> PASS

설계한 JWT 토큰 핸들링 방법

1. 클라이언트에서 API를 호출할때 헤더 쿠키에 access token을 함께 보낸다.
2. Guard에서 검사 후 access token이 유효하면 API 호출을 허락한다.
3. 만약 access token이 유효하지 않다면, 클라이언트에 access token이 만료되었다는 에러를 보낸다.
4. access token 만료 에러를 받은 클라이언트는 access token 갱신 api를 보낸다.
5. access token 갱신 요청을 받은 서버는 access token을 기반으로 데이터베이스에 저장된 refresh token을 조회한다.
6. refresh token이 만료되지 않았다면 access token을 재발급하고 클라이언트에 response를 보낸다.
7. access token이 재발급된 클라이언트는 다시 api 요청을 보낸다.
8. refresh토큰이 만료되었다면 클라이언트로 에러를 던진다.
9. 에러를 받은 클라이언트는 유저를 로그아웃 시킨다.

### Gemini 답변

https://g.co/gemini/share/b9f8c7770098

### Chat GPT 답변

당신의 JWT 토큰 검증 및 갱신 프로세스는 기본적으로 안전한 구조를 갖추고 있습니다. 그러나 몇 가지 주의해야 할 점과 개선 가능한 부분이 있습니다.

1. **Access Token의 보안**: 헤더나 쿠키를 통해 전송되는 Access Token은 안전한 방식으로 전송되어야 합니다. HTTPS를 사용하여 통신하는 것이 중요합니다.
2. **Refresh Token의 보안**: Refresh Token은 더욱 민감한 정보이므로 안전한 저장 및 전송이 필요합니다. 암호화된 저장소에 저장하거나 안전한 HttpOnly 쿠키를 사용하는 것이 좋습니다.
3. **Access Token 만료 시간 설정**: Access Token의 만료 시간은 보안적 측면에서 중요합니다. 너무 짧으면 자주 갱신해야 하고, 너무 길면 보안상 위험이 될 수 있습니다. 적절한 만료 시간을 설정하세요.
4. **Refresh Token 만료 시간 설정**: Refresh Token도 마찬가지로 적절한 만료 시간을 설정해야 합니다. 또한, Refresh Token이 만료되었을 때 사용자 로그아웃 등의 추가 조치를 취할 수 있습니다.
5. **Refresh Token 재사용 방지**: Refresh Token이 여러 번 사용되지 않도록 서버 측에서 확인 및 처리하는 로직을 추가하는 것이 좋습니다.
6. **갱신 프로세스에서의 보안 강화**: Refresh Token을 기반으로 Access Token을 재발급할 때, 클라이언트에게 응답하는 데이터를 최소화하여 보안을 강화할 수 있습니다.
7. **클라이언트의 에러 핸들링**: 클라이언트에서 Access Token 만료 에러를 받았을 때 적절히 처리하는 것이 중요합니다. 에러 메시지를 분석하고, 필요한 조치를 취할 수 있도록 설계되어야 합니다.
8. **보안 강화를 위한 추가 기능**: 필요에 따라 JWT를 검증하기 위해 서명 검증, 클레임 검증 등을 추가로 수행하여 보안을 높일 수 있습니다.
   위의 지적 사항들을 고려하여 프로세스를 개선하면 더욱 안전하고 효율적인 JWT 토큰 관리 시스템을 구축할 수 있을 것입니다.

둘다 비슷한 답변의 양상을 보이므로 보안상 괜찮은걸로 보인다. 이렇게 구현함.

클라이언트 (Next.js)에서는 미들웨어에서 위의 과정을 처리하면 된다.
