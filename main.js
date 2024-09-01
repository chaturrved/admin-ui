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
          <button class="edit" onclick="handleEdit('${user.id}')">
            <img class="icon blue" src="edit.svg" alt="edit button">
          </button>
          <button class="delete" onclick="handleDelete('${user.id}')">
            <img class="icon red" src="trash-2.svg" alt="delete all icon">
          </button>
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

function handleSelectAll() {
  const selectAllCheckbox = document.getElementById('selectAll');
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageUserIds = filteredUsers.slice(start, end).map(user => user.id);

  if (selectAllCheckbox.checked) {
    selectedRows = [...new Set([...selectedRows, ...pageUserIds])];
  } else {
    selectedRows = selectedRows.filter(id => !pageUserIds.includes(id));
  }
  renderTable();
}

function handleEdit(id) {
  const row = document.querySelector(`tr:has(input[onchange="handleRowSelect('${id}')"])`);
  const cells = row.querySelectorAll('td');
  cells[1].innerhtml = `<input type="text" value="${users.find(u => u.id === id).name}">`;
  cells[2].innerhtml = `<input type="text" value="${users.find(u => u.id === id).email}">`;
  cells[3].innerhtml = `<input type="text" value="${users.find(u => u.id === id).role}">`;
  cells[4].innerhtml = `<button class="save" onclick="handleSave('${id}')">Save</button>`;
};

function handleSave(id) {
  const row = document.querySelector(`tr:has(input[onchange="handleRowSelect('${id}')"])`);
  const cells = row.querySelectorAll('td');
  const newName = cells[1].querySelector('input').value;
  const newEmail = cells[2].querySelector('input').value;
  const newRole = cells[3].querySelector('input').value;

  const userIndex = users.findIndex(u => u.id === id);
  users[userIndex] = { ...users[userIndex], name: newName, email: newEmail, role: newRole };
  filteredUsers = users;
  renderTable();
}

function handleDelete(id) {
  users = users.filter(user => user.id !== id);
  filteredUsers = filteredUsers.filter(user => user.id !== id);
  selectedRows = selectedRows.filter(rowId => rowId !== id);
  renderTable();
  renderPaginationButtons();
  deletedPageToLastPage();
};



function deleteSelected() {
  users = users.filter(user => !selectedRows.includes(user.id));
  filteredUsers = filteredUsers.filter(user => !selectedRows.includes(user.id));
  selectedRows = [];
  renderTable();
  renderPaginationButtons();
  deletedPageToLastPage();
}

function deletedPageToLastPage() {
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  if (currentPage > totalPages) {
    changePage(totalPages);
  }
}

//To Make functions available globally for inline html ex: onclick
window.handleEdit = handleEdit;
window.handleSave = handleSave;
window.handleDelete = handleDelete;
window.handleRowSelect = handleRowSelect;
window.handleSelectAll = handleSelectAll;
window.deleteSelected = deleteSelected;
window.changePage = changePage;

fetchUsers();
