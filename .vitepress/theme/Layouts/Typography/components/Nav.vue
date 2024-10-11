<script setup></script>
<template>
  <header>
    <!-- logo -->
    <hgroup
      lg="write-vertical-right items-start b-l-2px b-l-[var(--tg-primary-color)] text-left"
      flex="~ col gap-2.5"
      class="cursor-pointer text-center duration-800 ease-in-out">
      <a
        class="common-link !decoration-none duration-800 ease-in-out"
        lg:p="x-2.5 b-12 hover:t-3.75 hover:b-8.75"
        href="/">
        <h3 class="text-5 font-extrabold">Typography</h3>
        <h1 class="text-8 font-extrabold">Cornor Blog</h1>
      </a>
    </hgroup>
    <!-- <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
      <path
        d="M417.588 192.025c-18.2-1.4-33.6 14-33.6 32.399v31.999c0 17.2 13.6 30.599 30.8 31.599 170.595 11.8 306.39 150.595 320.79 321.39 1.4 17 14.6 30.4 31.6 30.4h32.398c18.2 0 33.6-15.4 32.4-33.6-16.6-220.793-193.395-397.788-414.388-414.187zM417.388.03c-18.2-.8-33.4 14.4-33.4 32.6v31.998c0 17.2 13.6 30.6 30.8 31.6C691.18 111.626 914.373 332.82 927.973 609.011c.8 17.2 14.4 31 31.599 31h31.999c18.2 0 33.399-15.2 32.599-33.4C1006.97 279.822 744.178 17.03 417.388.03zM273.992 448.017h-18c-17.599 0-31.999 14.4-31.999 31.999v63.998c0 17.6 14.4 32 32 32h21.799c93.997 0 175.995 76.797 169.795 170.594-5.2 79.798-69.198 143.596-148.796 148.996-93.997 6.4-170.795-75.598-170.795-169.795V224.024c0-17.6-14.4-32-31.999-32H32c-17.6 0-31.999 14.4-31.999 32v497.985c0 165.195 132.996 307.39 297.991 301.791 150.796-5.2 272.592-126.996 277.792-277.792 5.8-164.995-136.596-297.991-301.791-297.991z" />
    </svg> -->
    <!-- Nav: navs & links -->
    <nav class="text-center font-bold" flex="~ col items-center lg:items-start gap-y-4">
      <!-- Navs -->
      <ul flex="~ lg:col gap-x-2 gap-y-2" class="text-16px">
        <li><a class="common-link" href="/">文章</a></li>
        <li><a class="common-link" href="/">归档</a></li>
        <li><a class="common-link" href="/">分类</a></li>
      </ul>
      <!-- Links -->
      <ul flex="~ gap-x-1">
        <li>
          <a
            href="https://github.com/zymbth"
            target="_blank"
            title="github"
            class="not-underline-hover inline-flex items-center">
            <span class="i-mdi-github w-6 h-6">github</span>
          </a>
        </li>
        <li>
          <a
            href="https://ymzhao.work"
            target="_blank"
            title="github"
            class="not-underline-hover inline-flex items-center">
            <span class="i-mdi-web w-6 h-6">Website</span>
          </a>
        </li>
        <li>
          <a
            href="https://codepen.io/zymbth"
            target="_blank"
            title="github"
            class="not-underline-hover inline-flex items-center">
            <span class="i-mdi-codepen w-6 h-6">Codepen</span>
          </a>
        </li>
      </ul>
    </nav>
  </header>
</template>
