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
    renderPaginationButtons();
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

function renderPaginationButtons() {
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const pageNumbers = document.getElementById('pageNumbers');
  pageNumbers.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.onclick = () => changePage(i);
    if (i === currentPage) {
      button.disabled = true;
    }
    pageNumbers.appendChild(button);
  }
}

function changePage(action) {
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  switch (action) {
    case 'first':
      currentPage = 1;
      break;
    case 'previous':
      currentPage = Math.max(1, currentPage - 1);
      break;
    case 'next':
      currentPage = Math.min(totalPages, currentPage + 1);
      break;
    case 'last':
      currentPage = totalPages;
      break;
    default:
      currentPage = action;
  }

  renderTable();
  renderPaginationButtons();
}

function handleRowSelect(id) {
  if (selectedRows.includes(id)) {
    selectedRows = selectedRows.filter(rowId => rowId !== id);
  } else {
    selectedRows.push(id);
  }
  renderTable();
}

function handleEdit(id) {
};

function handleDelete(id) {
};

//To Make functions available globally for inline html ex: onclick
window.changePage = changePage;

fetchUsers();
