---
layout: default
title: "The Two Gospels Updates"
permalink: /two-gospels/
---

# The Two Gospels: Development Log
*Tracking the research and progress of the upcoming study.*

---

<ul class="book-post-list">
  {% for post in site.categories.two-gospels %}
    <li>
      <strong>{{ post.date | date: "%B %d, %Y" }}</strong> — 
      <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>

<hr>
[Return to Main Blog]({{ site.baseurl }}/blog)