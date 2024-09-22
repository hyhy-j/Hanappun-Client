import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./MealSecond.css";

const MealSecond = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const today = new Date();
  const week = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = week[today.getDay()];
  const formattedDate = `${
    today.getMonth() + 1
  }월 ${today.getDate()}일 ${dayOfWeek}요일`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // location.state로부터 필요한 데이터 가져오기
  const { newMeal, mealItem } = location.state || {};
  // newMeal은 새로 생성할 메뉴 이름, mealItem은 DB에서 불러온 기존 메뉴 정보

  // 메뉴와 선택된 요소 상태 관리
  const [selectedMealItem, setSelectedMealItem] = useState(
    mealItem?.id || Date.now() // 기존 메뉴가 있으면 그 ID를 사용, 없으면 새로운 ID 생성
  );
  const [mealName, setMealName] = useState(newMeal || mealItem?.name || "");
  const [mealElements, setMealElements] = useState(() => {
    const initialState = mealItem?.selectedElements || [];
    return { [selectedMealItem]: initialState };
  });

  // 카테고리별 요소들
  const elementCategories = {
    "동물성 단백질": [
      "쇠고기",
      "돼지고기",
      "닭고기",
      "오리고기",
      "우유",
      "유제품",
      "버터",
      "치즈",
      "바다 생선",
      "민물 생선",
      "조개류",
      "굴",
      "갑각류",
      "흰살생선",
      "붉은살 생선",
      "복어",
      "녹용",
    ],
    "식물성 단백질": [
      "콩",
      "팥",
      "밤",
      "청국장",
      "견과류",
      "도토리",
      "된장",
      "두부",
    ],
    "탄수화물(곡류)": [
      "백미",
      "현미",
      "찹쌀",
      "보리",
      "메밀",
      "옥수수",
      "밀가루",
    ],
    "근채류(뿌리채소)": ["감자", "고구마", "생강", "도라지", "마"],
    "채소(잎, 줄기채소)": [
      "배추",
      "상추",
      "깻잎",
      "오이",
      "호박",
      "가지",
      "토마토",
      "시금치",
      "아보카도",
    ],
    "허브 및 양념류": ["고추", "마늘", "설탕", "꿀"],
    해조류: ["미역", "김"],
    과일: [
      "와인",
      "알로에",
      "사과",
      "망고",
      "수박",
      "청포도",
      "참외",
      "딸기",
      "모과",
      "복분자",
      "감",
    ],
  };

  const handleElementClick = (element) => {
    setMealElements((prevElements) => {
      const updatedElements = { ...prevElements };
      const currentElements = updatedElements[selectedMealItem] || [];

      if (currentElements.includes(element)) {
        // 이미 선택된 요소라면 제거
        updatedElements[selectedMealItem] = currentElements.filter(
          (e) => e !== element
        );
      } else if (currentElements.length < 4) {
        // 선택되지 않은 요소이고, 현재 선택된 요소가 4개 미만이라면 추가
        updatedElements[selectedMealItem] = [...currentElements, element];
      }

      return updatedElements;
    });
  };

  const handleSave = async () => {
    const currentMealElements = mealElements[selectedMealItem];

    if (!currentMealElements || currentMealElements.length === 0) {
      alert("한 개 이상의 요소를 선택해주세요");
      return;
    }

    // 저장할 데이터 구조
    const dataToSave = {
      id: selectedMealItem,
      name: mealName,
      selectedElements: currentMealElements,
      date: params.date,
    };

    try {
      const response = await fetch("/api/save-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        navigate(`/meal/first/${params.username}/${params.date}`);
      } else {
        alert("저장하는데 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="MSbackground">
      <header className="blackHeader">
        <img alt="back" onClick={() => navigate(-1)} src="/images/back.png" />
        <h2 className="MSh2">오늘의 식사</h2>
      </header>
      <div className="MSdate">{formattedDate}</div>
      <main className="MSmain">
        <div className="MSmenu">
          <button className="MSselected">{mealName}</button>
          <hr />
        </div>

        <div className="MScontents">
          <p>
            <span className="MSbold">음식의 구성요소를 선택해주세요</span>
            <br /> 높은 비중을 차지한 순으로{" "}
            <span className="MSbold">최대 4개</span>를 선택할 수 있어요
          </p>
          {Object.keys(elementCategories).map((category) => (
            <div key={category} className="meal_category">
              <h3>{category}</h3>
              <hr />
              {elementCategories[category].map((element) => (
                <button
                  key={element}
                  onClick={() => handleElementClick(element)}
                  className={
                    mealElements[selectedMealItem]?.includes(element)
                      ? "MSselected"
                      : ""
                  }
                >
                  {element}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="MSbtns">
          <button className="MSpurpleBtn" onClick={handleSave}>
            저장하기
          </button>
        </div>
      </main>
    </div>
  );
};

export default MealSecond;
