const PAGE_SIZE = 10;
const api_url = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';
let users = [];
let filteredUsers = [];
let currentPage = 1;
let selectedRows = [];

async function fetchUsers() {
  try {
    //get users from api
    const response = await fetch(api_url);
    users = await response.json();
    filteredUsers = [...users];
    renderTable();
    console.log(users);
  } catch (error) {
    console.log('Error fetching users:', users);
  }
}

function renderTable() {
  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageUsers = filteredUsers.slice(start, end);

  pageUsers.forEach((user) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
          <input type="checkbox" ${selectedRows.includes(user.id) ? 'checked' : ''} onchange="handleRowSelect('${user.id}')">
        </td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>
          <button class="edit" onclick="handleEdit('${user.id}')">Edit</button>
          <button class="delete" onclick="handleDelete('${user.id}')">Delete</button>
        </td> 
    `;

    if (selectedRows.includes(user.id)) {
      row.classList.add('selected');
    }

    tableBody.appendChild(row);
  })
}

fetchUsers();
