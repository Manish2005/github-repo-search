import { gql } from "@apollo/client"

export const GET_USER = gql`
   query ($userQuery: String!){
      search(query: $userQuery, type: USER, first: 1){
          nodes{
            ... on User {
              avatarUrl
              bio
              followers {totalCount}
              following {totalCount}
              id
              login
              name
            }
          }
       }
    }
  `

