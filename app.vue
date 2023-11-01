<template>
  <div class="h-screen grid place-content-center main-container">
    <div class="flex flex-col justify-start">
      <label for="users" class="text-[#7C7C7C]">Field</label>

      <div class="mx-auto flex w-[260px] z-10">
        <div
          class="w-full rounded-md bg-gradient-to-r from-[#FFC700] to-[#A5E870] p-[2px]"
        >
          <div class="flex h-full w-full items-center bg-white rounded-[4px]">
            <input
              name="users"
              v-model="searchQuery"
              @change="searchUsers"
              @input="searchUsers"
              @keydown.down="onKeyDown(0)"
              @keydown.enter="onEnter"
              placeholder="GitHub username"
              class="rounded-[4px] pl-2 text-base w-full h-8 outline-none"
              autofocus
            />

            <img
              v-if="isLoading"
              class="animate-spin"
              src="@/assets/images/icons/loading-icon.svg"
              alt=""
            />

            <img
              @click="toggleShowList"
              class="duration-500 cursor-pointer"
              :class="{ 'rotate-180': isShowList }"
              src="@/assets/images/icons/chevron-down-icon.svg"
              alt=""
            />
          </div>
        </div>
      </div>
      <div class="h-[140px]">
        <transition name="dropdown" mode="in-out">
          <div
            class="w-full rounded-md bg-gradient-to-r from-[#FFC700] to-[#A5E870] p-[2px] -mt-2"
            v-if="hintList?.length && isShowList"
          >
            <div class="flex h-full w-full items-center bg-white py-2">
              <ul
                v-if="hintList.length"
                class="overflow-auto w-full h-[130px] text-base font-medium"
              >
                <li
                  v-for="(user, index) in hintList"
                  :key="index"
                  @click="selectUser(user.login)"
                  :tabindex="index"
                  @keydown.enter="selectUser(user.login)"
                  @keydown.up="onKeyUp(index)"
                  @keydown.down="onKeyDown(index)"
                  class="cursor-default outline-none"
                >
                  <span class="p-2">
                    {{ user.login.toLowerCase() }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const searchQuery = ref("");
const isShowList = ref(false);
const isLoading = ref(false);
const hintList = ref([]);
const apiUrl = "https://api.github.com/search/users?q=";

async function searchUsers() {
  if (searchQuery.value.trim() === "") {
    hintList.value = [];
    return;
  }

  isLoading.value = true;

  try {
    const response = await fetch(apiUrl + searchQuery.value + "+in:login", {
      headers: {
        Authorization: "Bearer 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",
      },
    });
    if (response.ok) {
      const data = await response.json();
      hintList.value = data.items;
      console.log();
      if (data.items.length === 0) {
        hintList.value.push({
          login: "No users found",
        });
      }
    } else {
      console.error("Failed to fetch data from GitHub API");
    }
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
  }

  isLoading.value = false;
}

//user login will be here
const selectUser = (login) => {
  searchQuery.value = login;
  searchUsers();
};

function toggleShowList() {
  if (searchQuery.value.trim() === "") return;
  isShowList.value = !isShowList.value;
}

function onEnter() {
  if (searchQuery.value.trim() === "") return;
  isShowList.value = true;
  document.activeElement.blur();
  setTimeout(() => {
    focusItem(0);
  }, 100);
}

const focusItem = (index) => {
  const li = document.querySelector(`li[tabindex="${index}"]`);
  console.log(li.style);
  li.focus();
};

const onKeyUp = (index) => {
  if (index > 0) {
    focusItem(index - 1);
  }
};

const onKeyDown = (index) => {
  if (index < hintList?.value?.length - 1) {
    focusItem(index + 1);
  }
};
</script>
<style scoped>
.main-container {
  font-family: "Commissioner";
}

li:hover,
li:focus {
  background: rgba(255, 201, 4, 0.17);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
