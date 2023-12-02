# GitHub Repositories With Search Functionality

live site [here](https://anne-mfl.github.io/github-repo-search/)

This is a simplified version of GitHub Repositories, where you can filter by github username and display their repositories in a list. It is also possible to filter through the list of repositories by the name of the repository and by the programming language.

## How to run

create a .env file and paste the [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) that you created.

```
REACT_APP_GITHUB_TOKEN=<YOUR TOKEN>
```

## How to run test

```bash
npm test
```

## Future improvements

### add pagination
Currently, it only retrieves first 100 repositories of a user.

### optimizing search
When the user stops typing, there should be few seconds of delay before the search to start. Currently the query is called everytime the user changes the value of input.

### add error boundary
When an error occurred when retrieving data, an error message should be displayed




