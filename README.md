# Collab Platform

이 프로젝트는 협업을 위한 웹 애플리케이션으로, 다음의 기술 스택을 사용하여 구현되었습니다.

## 🚀 기술 스택

- **Backend**: Spring Boot
- **Frontend**: React
- **Database**: MariaDB

## 📁 프로젝트 구조

프로젝트는 다음과 같은 구조로 구성되어 있습니다.

```
collab-platform
├── front-end        # React 기반 프론트엔드 코드
├── .gradle          # Gradle 빌드 관련 설정
├── .idea            # IntelliJ IDEA 프로젝트 설정
├── .gitignore       # Git에서 제외할 파일 정의
└── .gitattributes   # Git 특성 관리
```

## 🛠 설치 및 실행 방법

### 1. MariaDB 설치 및 데이터베이스 설정

```bash
brew install mariadb
brew services start mariadb

mysql -u root -p
create database collab_platform;
```

### 2. Backend (Spring Boot) 실행

프로젝트 루트에서 다음 명령어를 실행하세요:

```bash
./gradlew bootRun
```

### 3. Frontend (React) 실행

```bash
cd front-end
npm install
npm run start
```

브라우저에서 `http://localhost:3000`에 접속하면 애플리케이션을 확인할 수 있습니다.

## 🔑 설정

데이터베이스 연결 정보는 Spring Boot의 `application.properties` 또는 `application.yml` 파일에 설정하세요:

```properties
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver
spring.datasource.url=jdbc:mariadb://localhost:3306/collab_platform
spring.datasource.username=root
spring.datasource.password=your_password
```

## 📖 기타

- 자세한 정보나 문제 해결을 원하시면 프로젝트 관리자를 통해 문의하세요.

## 🌟 기여하기

이 프로젝트에 기여하고 싶다면 자유롭게 Pull Request를 보내주세요!

