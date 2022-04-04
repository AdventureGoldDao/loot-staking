import axios from 'axios'

const client = axios.create({
  baseURL: `https://api.opensea.io/api/v1/collection/`,
  responseType: 'json'
})

export async function fetchOpenseaProject(project: string) {
  return await client.get(`${project}/stats`, {
    params: {}
  })
}
