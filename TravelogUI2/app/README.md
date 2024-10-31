# Instructions for using Login Context

- The Context API allows us to wrap our entire application around a LoginProvider, allowing us to keep track of the user's token and email no matter where they are in the application.

- The Login Provider exposes the following two values: `email` and `accessToken` (the user's token).

- To read from the Login Provider:

```javascript
import {useLoginContext} from '../path/to/context/LoginContext'

const loginContext = useLoginContext();

// OR

const { email, accessToken } = useLoginContext();

```

- To modify some values in the Login Provider:

```javascript

const loginContext = useLoginContext();

loginContext.setEmail('value to set');
loginContext.setAccessToken('token to set');

// OR

const { setEmail, setAccessToken } = useLoginContext();

setEmail('value to set');
setAccessToken('token to set');


```
