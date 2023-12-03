import { gql } from "@apollo/client";

export const GET_REPOSITORIES = gql`
     query($searchQuery: String!) {
      search(query: $searchQuery, type:REPOSITORY, first:100) {
        repositoryCount
        nodes {
          ... on Repository {
            description
              id
              isPrivate
              primaryLanguage {
                color 
                name
              }
              name
              pushedAt
              url
          }
        }
      }
    }
  `