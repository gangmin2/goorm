// 검색 input 요소에 username을 입력 후 엔터키를 입력했을 때
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        const username = searchInput.value;
        if (username) {
            fetchUserInfo(username);
        }
    }
})

/** GitHub API 엔드포인트 URL */
const apiUrl = 'https://api.github.com/users/';
const githubToken = "your github token";

/** 유저 정보를 가져오는 함수 */
async function fetchUserInfo(username) {
    try {
        const response = await fetch(apiUrl + username, {
            headers: {
                Authorization: githubToken,
            }
        });
        if (response.ok) {
            const userInfo = await response.json();
            // 유저 데이터 렌더링
            renderUserInfo(userInfo);
            // 최근 레포 렌더링
            fetchRepos(userInfo.repos_url);
        } else {
            alert('Not Found... :(');
        }
    } catch (err) {
        console.error(err);
    }
}

/** 가져온 유저 정보 렌더링하는 함수 */
function renderUserInfo(userInfo) {
    // 프로필 이미지 변경
    document.getElementById('profile-img').src = userInfo.avatar_url;

    // View Profile 버튼 클릭 시 GitHub User 웹 사이트로 이동
    document.getElementById('profile-button').href = userInfo.html_url;

    // 유저 정보 기입
    document.getElementById('profile-badge-list').innerHTML = `
        <li class="badge bg-primary">Public Repos: ${userInfo.public_repos}</li>
        <li class="badge bg-secondary">Public Gists: ${userInfo.public_gists}</li>
        <li class="badge bg-success">Followers: ${userInfo.followers}</li>
        <li class="badge bg-info">Following: ${userInfo.following}</li>
    `
    document.getElementById('profile-info-list').innerHTML = `
        <li>Company: ${userInfo.company || "정보 없음"}</li>
        <li>Website/Blog: ${userInfo.blog || "정보 없음"}</li>
        <li>Location: ${userInfo.location || "정보 없음"}</li>
        <li>Member Since: ${userInfo.created_at || "정보 없음"}</li>
    `
}

/** 유저의 레포지토리 정보를 가져오는 함수 */
async function fetchRepos(reposUrl) {
    try {
        // 업데이트 순으로 정렬된 레포지토리 정보 가져옴.
        const response = await fetch(reposUrl + '?sort=updateed', {
            headers: {
                Authorization: githubToken,
            }
        });
        if (response.ok) {
            const repos = await response.json();
            renderRepos(repos);
        }
    } catch (err) {
        console.error(err);
    }
}

/** 최근 4개의 레포지토리를 렌더링하는 함수 */
async function renderRepos(repos) {
    let repoContainer = document.getElementById('repos-container');
    repoContainer.innerHTML = '<h3>Latest Repos</h3>';

    // 최근 4개의 레포지토리만 요소로 추가
    repos.slice(0, 4).forEach(repo => {
        const newRepo = document.createElement('div');
        newRepo.classList.add('box', 'repo-box');
        newRepo.innerHTML = `
            <a class="f1" href=${repo.html_url}>${repo.name}</a>
            <div class="f1">
                <span class="badge bg-primary">Stars: ${repo.stargazers_count}</span>
                <span class="badge bg-secondary">Watchers: ${repo.watchers}</span>
                <span class="badge bg-success">Forks: ${repo.forks}</span>
            </div>
        `
        repoContainer.appendChild(newRepo);
    });
};

// 기본 첫 페이지 렌더링
fetchUserInfo('github');