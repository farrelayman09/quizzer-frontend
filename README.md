# Quizzer

A responsive Vue-based web application for creating, managing, and taking practice tests. Seamlessly integrated with the [Quizzer API][QuizzerAPI-url] backend.

## Description

Practice tests (tryout) web application implementing robust access control with JWT access and refresh tokens, using middlewares to restrict endpoint access based on user roles and tryout ownership. Users can effectively manage their tryouts, manage questions within them, take tryouts and access their past submissions for review.

## Built With

[![Vue][Vue.js]][Vue-url] 

## Features

* **Tryout Management**: Create, view, edit, and delete practice tests with custom configurations
* **Question Management**: Add, edit, and remove questions with support for multiple choice, true/false, and short answer formats
* **Submission System**: Take tryouts through a dedicated interface and submit answers for evaluation
* **Submission History**: Access and review past submissions including answers and scores
* **Secure Authentication**: JWT-based authentication with automatic token refresh mechanism ensuring both security and seamless user experience
* **Responsive Design**: Fully mobile-responsive interface that adapts to any device, enabling learning on-the-go


## Getting Started


### Dependencies

* [Node.js][Node-url] (latest)
* npm 

### Installing

1. Clone the repository
``` 
git clone https://github.com/farrelayman09/quizzer-frontend.git
cd quizzer-frontend
```

2. Install dependencies:
```
npm install
```

### Executing program

```
npm run dev
```

This will start the development server on port 8080 as configured in the vite.config.mjs file. Access the application by navigating to http://localhost:8080 in your web browser.

## Pages

* **Guest(```/guest```)**: View the available tryouts
* **Login(```/login```)**: Login as a registered User
* **Register(```/register```)**: Register as a new User
* **Home(```/```)**: View and Take the available tryouts
* **My Tryouts(```/my-tryouts```)**: Manage your tryouts (Create, View, Edit and Delete)
* **My Questions(```/my-tryouts/:id/questions```)**: Manage your tryout questions (Create, View, Edit and Delete)
* **Do Tryouts(```/do-tryout/:id```)**: Take available tryout with the referenced id
* **My Submissions(```/my-submissions```)**: View previous submissions and their answers

## API Integration
The frontend integrates with a custom Quizzer API backend through four main endpoint groups:
* **Authentication Group**:
Handles user registration, login/logout operations, and JWT token management. Implements a secure token rotation strategy with 15-minute access tokens and 1-hour refresh tokens to maintain continuous authentication while enhancing security.
* **Tryout Group**:
Manages all tryout-related operations including creation, retrieval, updating, and deletion. Includes endpoints for both public tryout listings and user-specific tryout management with appropriate access control.
* **Questions Group**:
Controls the questions within tryouts, allowing tryout owners to create, modify, and remove questions of various formats. All endpoints enforce ownership validation through middleware authentication.
* **Submission Group**: 
Handles test-taking functionality and submission history. Records user answers, calculates scores, and provides access to past submissions for review and analysis.

## Authentication and Authorization System

All API requests requiring authentication use Bearer token authorization headers, with the frontend automatically handling token refresh when needed. Middleware on the backend validates user permissions based on roles and resource ownership.
Access tokens are stored in memory and included as Authorization Bearer headers with each request.
Refresh tokens are securely stored and automatically used to obtain new access tokens when needed.

A token interceptor handles 401 responses by attempting token refresh before retrying failed requests.
Token expiration is synchronized with backend settings (access: 15 minutes, refresh: 1 hour).
On logout or token expiration, all tokens are cleared and user is redirected to the login page.
This secure token rotation strategy ensures continuous authentication while maintaining security best practices.

<!-- MARKDOWN LINKS & IMAGES -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Express.js]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[JWT]: https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white
[JWT-url]: https://jwt.io/
[MongoDB]: https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[Node-url]: https://nodejs.org/en
[QuizzerAPI-url]:https://github.com/farrelayman09/quizzer-backend