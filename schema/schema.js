const graphql = require('graphql');
const axios = require('axios');
const { response } = require('express');

const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLSchema,
    GraphQLList
} = graphql;

const users = [
    {id: '23', firstName: 'Bill', age: 20},
    {id: '47', firstName: 'Samantha', age: 21}
];

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        
            id: { type: GraphQLString },
            name: { type: GraphQLString },
            description: { type: GraphQLString },
            users: {
                type: new GraphQLList(UserType),
                resolve(parentValue, args) {
                    console.log(parentValue, args);
                    return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                    .then(response => response.data);
                }
            }
        
    })
});


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString},
        age: { type: GraphQLInt},
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                console.log(parentValue, args);
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                .then(res => res.data)
                .then(data => data);
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`)
                .then(response => response.data)
                .then(data => data);
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString }},
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                .then(response => response.data)
                .then(data => data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});