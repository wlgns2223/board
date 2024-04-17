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

## 설계한 JWT 토큰 핸들링 학습과 방법

### API 요청시

1. API요청시 Guard에서 Access Token을 검증한다.
2. Access Token이 유효하다면, API를 실행한다.
3. Access Token이 만료되었을 경우, 토큰 만료 에러를 던진다.
   2-1. Filter 또는 Intercepter에서 토큰 만료 에러를 처리한다. (global Filter로 구현)
   2-2. Refresh 토큰을 확인하여 Refresh 토큰이 유효하다면 Access Token을 재발급한다.
   2-2. Refresh 토큰이 만료되었을 경우, 클라이언트를 로그아웃 시킨다.
4. Access Token이 유효하지 않을 경우, 클라이언트를 로그아웃 시킨다.

#### 1. Access Token이 유효하지 않을 경우 401 에러를 던지는 경우

1. API요청시 Guard에서 Access Token을 검증한다.
2. Access Token이 유효 할 경우, API를 실행한다.
3. Access Token이 만료 및 유효하지 않을경우 에러를 던진다.  
   3.1 만료 된 경우: 401에러와 만료 에러메세지  
   3.2 유효하지 않은 경우: 401에러와 유효하지 않은 에러메세지
4. 에러를 받은 클라이언트는 토큰 Refresh 과정에 따라서 Access Token을 재발급 요청을 보낸다.
5. 토큰을 성공적으로 재발급 받았다면 API를 재요청한다.

#### 2. Access Token이 유효하지 않을 경우 자동으로 재발급하는 경우

1. API요청시 Guard에서 Access Token을 검증한다.
2. Access Token이 유효 할 경우, API를 실행한다.
3. Access Token이 만료 및 유효하지 않을경우 에러를 던진다.  
   3.1 만료 된 경우  
   a. Filter 또는 Intercepter에서 토큰 만료 에러를 처리한다. (global Filter로 구현)  
    b. Refresh 토큰을 확인하여 Refresh 토큰이 유효하다면 Access Token을 재발급한다.  
    c. Refresh 토큰이 만료되었을 경우, 클라이언트를 로그아웃 시킨다.

   3.2 유효하지 않은 경우: 적당한 에러를 던져 클라이언트를 로그아웃 시킨다.

4. 에러를 받은 클라이언트는 로그아웃한다.

#### 3. Access Token의 만료시간을 계산하여 만료가 되기전에 재발급하는 경우

1. API요청시 Guard에서 Access Token을 검증한다.
2. Access Token이 유효 할 경우, API를 실행한다.
3. 만료시간이 곧 도래한다면 Access Token을 재발급한다.
4. Access Token이 만료 및 유효하지 않을경우 에러를 던진다.  
   3.1 만료 된 경우  
   a. Filter 또는 Intercepter에서 토큰 만료 에러를 처리한다. (global Filter로 구현)  
    b. Refresh 토큰을 확인하여 Refresh 토큰이 유효하다면 Access Token을 재발급한다.  
    c. Refresh 토큰이 만료되었을 경우, 클라이언트를 로그아웃 시킨다.

   3.2 유효하지 않은 경우: 적당한 에러를 던져 클라이언트를 로그아웃 시킨다.

5. 에러를 받은 클라이언트는 로그아웃한다.

#### 결정

1,2,3번의 방법을 고려해본 결과 1번의 방법대로 구현을 하는게 가장 적절하다고 생각한다.

1,2,3번 방법의 공통점은 클라이언트가 토큰 만료 에러를 받았을 때, 클라이언트가 토큰 재발급 요청을 보내야한다는 것이다.

2,3번이 좋아보였던 이유는 클라이언트가 토큰요청을 하지 않고 백엔드에서 토큰만료이슈를 자동으로 처리하여 API를 실행하고 클라이언트는
토큰이 만료되었더라도 백엔드에서 자동으로 이를 처리하여 재발급요청을 보내지 않도록 하는것인데 이는 아래와 같은 이슈가 있음을 확인했다.

**2번 방법의 이슈**

- 토큰이 만료되어 에러를 던지면 Filter에서 에러를 처리해야한다. 이 과정에서 토큰을 재발급을 한다.
- 재발급 후 앞서 실패한 요청에 대해서 Nest.js의 라이프사이클을 뒤로 거슬러 API를 실행하는것은 힘들어 보인다.  
   그리고 보안적인 면에서도 좋지 않다.
- 그렇다면 새로운 토큰을 클라이언트에게 전달 후 클라이언트는 이를 인식하여 다시 API요청을 보내야한다.

**3번 방법의 이슈**

- 토큰이 만료되어 에러를 던지면 Filter에서 에러를 처리해야한다. 이 과정에서 토큰을 재발급을 한다.
- Guard 또는 Interceptor에서 항상 토큰의 만료시간을 계산해야하는 이슈가 있다.
- 만료기간이 도래하기전 새 토큰을 발급하더라도 2번의 이슈를 만난다. ( 클라이언트가 새로운 토큰을 인식하고 API요청을 보내야함 )
- Access Token이 만료 된 후 API 요청을 보내는 케이스가 당연히 있을 수 있다.
- 그렇다면 다시 1,2번 방법중 하나로 결정을 해야한다. ( 똑같은 문제의 발생 )

**결론**

- 2,3번 방법은 코드의 복잡도를 증가시킨다.
- 쿠키를 통해서 Access Token을 클라이언트에 보내주고 있기때문에 클라이언트가 새로운 토큰을 설정하기 위해서는 어짜피 클라이언트로 Access Token 관련해서 응답이 가야한다. 그렇다면 클라이언트 <-> 백엔드 요청의 횟수로만 따져봤을때는 토큰 재발급 요청을 줄여 요청을 줄여보고자 했던 2,3번방법은 유의미한 이점이 없어보인다.

### 토큰 Refresh 과정

1. 토큰 만료 에러를 받은 클라이언트는 Access Token과 Refresh Token을 가지고 토큰 재발급 요청을 한다.
2. /auth/refresh로 API 요청을 한다.
3. 토큰 검증 로직 실행
   3-1. access token 만료, refresh token 유효 -> ACCESS TOKEN 재발급
   3-2. access token 만료, refresh token 만료 -> 로그아웃
   3-3. access token 유효, refresh token 만료 -> 로그아웃

# TODO
