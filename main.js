const PAGE_SIZE = 10;
const api_url = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';
let users = [];

async function fetchUsers() {
  try {
    //get users from api
    const response = await fetch(api_url);
    users = await response.json();
    console.log(users);
  } catch (error) {
    console.log('Error fetching users:', users);
  }
}

fetchUsers();
