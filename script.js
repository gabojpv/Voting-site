// Store users
let users = JSON.parse(localStorage.getItem("users")) || [];
let polls = JSON.parse(localStorage.getItem("polls")) || [];

// Sign-Up Function
function signUp() {
    let username = document.getElementById("new-username").value;
    let password = document.getElementById("new-password").value;

    if (!username || !password) {
        alert("Please enter a username and password.");
        return;
    }

    if (users.some(user => user.username === username)) {
        alert("Username already taken!");
        return;
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account created! Please log in.");
    window.location.href = "login.html";
}

// Login Function
function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let user = users.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem("loggedInUser", username);
        window.location.href = "index.html";
    } else {
        alert("Invalid credentials!");
    }
}

// Logout Function
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}

// Create Poll
function createPoll() {
    let title = document.getElementById("poll-title").value;
    let category = document.getElementById("poll-category").value;
    let options = Array.from(document.querySelectorAll(".poll-option")).map(opt => opt.value);
    let username = localStorage.getItem("loggedInUser");

    if (!title || options.length < 2) {
        alert("Enter a poll question and at least two options.");
        return;
    }

    polls.push({ title, category, options, votes: Array(options.length).fill(0), createdBy: username });
    localStorage.setItem("polls", JSON.stringify(polls));
    alert("Poll created successfully!");
    window.location.href = "index.html";
}

// Display Polls
function displayPolls(filteredPolls = null) {
    let container = document.getElementById("polls-container");
    container.innerHTML = "";

    let displayedPolls = filteredPolls || polls;

    displayedPolls.forEach((poll, index) => {
        let totalVotes = poll.votes.reduce((a, b) => a + b, 0);
        
        let pollDiv = document.createElement("div");
        pollDiv.classList.add("poll-container");
        pollDiv.innerHTML = `
            <h3>${poll.title}</h3>
            <p><strong>Category:</strong> ${poll.category}</p>
            <p><strong>Created By:</strong> ${poll.createdBy}</p>
            ${poll.options.map((opt, i) => `
                <label>
                    <input type="radio" name="poll${index}" value="${i}">
                    ${opt} (${totalVotes > 0 ? ((poll.votes[i] / totalVotes) * 100).toFixed(1) + "%" : "0%"})
                </label><br>
            `).join("")}
            <button onclick="vote(${index})">Vote</button>
        `;
        container.appendChild(pollDiv);
    });
}

// Voting Function
function vote(index) {
    let selected = document.querySelector(`input[name="poll${index}"]:checked`);
    if (selected) {
        polls[index].votes[selected.value]++;
        localStorage.setItem("polls", JSON.stringify(polls));
        alert("Vote recorded!");
        displayPolls(); // Refresh the poll results after voting
    } else {
        alert("Select an option before voting!");
    }
}

// Filter Polls by Category
function filterPolls() {
    let category = document.getElementById("categories").value;
    let filteredPolls = category === "all" ? polls : polls.filter(poll => poll.category === category);
    displayPolls(filteredPolls);
}

// Load Polls on Page Load
if (document.getElementById("polls-container")) {
    displayPolls();
}