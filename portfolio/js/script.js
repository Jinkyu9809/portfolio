// 메뉴 이동
function setMenu (_menu){
    var menus = document.querySelectorAll("nav li");
    menus.forEach(function (menu) {
      menu.classList.remove('on');
    });
    document.querySelector("nav li." + _menu).classList.add("on");
    document.querySelector("main").className = _menu;
  }

  // 정렬 방식
  var sorts = {
    // 최신순으로 정렬
    recent: function (a, b) { return (a.idx > b.idx) ? -1 : 1},
    //좋아요 많은 순으로 정렬
    like: function (a, b) { return (a.likes > b.likes) ? -1 : 1},
  };
  // 현재 선택된 정렬 방식
  var sort = sorts.recent;

  // 필터 방식
  var filters = {
    all: function (it) { return true; },
    mine: function (it) { return it.user_id === my_info.id; },
    like: function (it) { return my_info.like.indexOf(it.idx) > -1; },
    follow: function (it) { return my_info.follow.indexOf(it.user_id) > -1; }
  };
  // 현재 선택된 필터
  var filter = filters.all;

  // 정렬 설정 & 적용
  
  function setSort(_sort) {
    document.querySelectorAll("#sorts li").forEach(function (sortLi){
      sortLi.classList.remove("on");
    });
    document.querySelector("#sorts li."+ _sort).classList.add("on");

    sort = sorts[_sort];
    showPhotos();
  }

  // 필터 설정 & 적용
  function setFilter (_filter) {
    document.querySelectorAll("#filters li").forEach(function (sortLi){
      sortLi.classList.remove("on");
    });
    document.querySelector("#filters li." +_filter).classList.add("on");

    filter = filters[_filter];
    showPhotos();
  }



// 사진올리기의 사진설명 길이 표시
function setDescLength () {
  document.querySelector(".descLength").innerHTML =
   document.querySelector("input.description").value.length + "/20";
}


function showMyInfo () {
  document.querySelector("#myInfoId").innerHTML = my_info.id;
  document.querySelector("#myInfoUserName").innerHTML = my_info.
  user_name;
  document.querySelector("#myInfoUsercall").innerHTML = my_info.
  user_call;
  document.querySelector("#ip-intro").value = my_info.
  introduction;
  document.querySelector("#sp-intro").innerHTML = my_info.
  introduction;
  document.querySelector("#myinfo input[type=radio][value=" +
  my_info.as + "]").checked = true;

  document.querySelectorAll("#myinfo input[type=checkbox]").
  forEach(function (checkbox){
      checkbox.checked = false;
      console.log(checkbox);
  });

  my_info.interest.forEach(function (interest) {
    document.querySelector("#myinfo input[type=checkbox][value=" +
    interest + "]").checked = true;
  });
}

function setEditMyInfo (on) {
  document.querySelector("#myinfo > div").className = on ? 
  'edit' : 'non-edit';
  document.querySelectorAll("#myinfo input").forEach(function (input) {
    input.disabled = !on;
  })
  showMyInfo ();
}

function updateMyInfo () {
  my_info.introduction = document.querySelector("#ip-intro").
  value;
  my_info.as = document.querySelector("#myinfo input[type=radio]:checked")
  .value;
  var interests = [];
  document.querySelectorAll("#myinfo input[type=checkbox]:checked")
  .forEach(function (checkbox) {
    interests.push(checkbox.value);
  });
  my_info.interest = interests;
  setEditMyInfo(false);
  showMyInfo();
}

// 사진들 새로 보여주기
function showPhotos () {

  // 현재 화면의 사진들 삭제
  var existingNodes = document.querySelectorAll("#gallery article:not(.hidden)");
  existingNodes.forEach(function (existingNode) {
    existingNode.remove();
  });

  // 갤러리 div 선택
  var gallery = document.querySelector("#gallery");

  // 필터 & 정렬 적용
  var filtered = photos.filter(filter);
  filtered.sort(sort);

  // 필터된 사진들 화면에 나타내기
  filtered.forEach(function (photo) {
    var photoNode = document.querySelector("article.hidden").
    cloneNode(true);
    photoNode.classList.remove("hidden");
    photoNode.querySelector(".author").innerHTML = photo.
    user_name;
    photoNode.querySelector(".desc").innerHTML = photo.
    description;
    photoNode.querySelector(".like").innerHTML = photo.
    likes;
    if (my_info.like.indexOf(photo.idx) > -1) {
      photoNode.querySelector(".like").classList.add('on');
    }
    photoNode.querySelector(".photo").style.backgroundImage
     = "url('./img/photo/" + photo.file_name +"')";
    photoNode.querySelector(".like").addEventListener('click',function() {
      toggleLike(photo.idx);
    });
    gallery.append(photoNode);
  });
}
//사진의 좋아요 토글
function toggleLike (idx) {
  if (my_info.like.indexOf(idx) === -1){
    my_info.like.push(idx);
    for (var i =0; i < photos.length; i++) {
      if (photos[i].idx === idx) {
        photos[i].likes++;
        break;
      }
    }    
  } else {
    my_info.like = my_info.like.filter(
      function (photo) {return photo !== idx;}
    );
    for (var i =0; i< photos.length; i++) {
      if(photos[i].idx === idx) {
        photos[i].likes--;
        break;
      }
    }
  }
    showPhotos();
}

// 화면이 처음 로드되면 실행되는 함수
function init () {
  showMyInfo();
  showPhotos();
}

