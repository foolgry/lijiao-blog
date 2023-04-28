2023-04-27

# CSS权威指南-上册  学习笔记 
lijiao 2023-04-28整理  

## 第一章  
**link标签：**  
```html
<link rel="stylesheet" type="text/css" href="sheet1.css" media="all">
```  
**style元素：**  
```
<style type="text/css"> </style> 
```  
**@import指令**  
```html
<style type="text/css"> @import url(sheet2.css);</style>
```  
**行内样式**  
```html
<p style="color:gray;">我是一段文本</p> 
```  
除了body元素之外的标签（如head或title），所有HTML标签都能设定style属性。  

**css注释**  
/*这是一段css注释*/  
在css中，注释只能使用/*   */编写  

**媒体类型**  
all 用于所有展示媒体  
print 在打印文档时使用，也在预览打印效果时使用  
screen 在屏幕上展示文档时使用  
```html
<link href="print-color.css" type="text/css" media="print and (color),screen and (color-depth:8)" rel="stylesheet">
```  
```css
@import url(print-color.css) print and (color),screen and (color-depth:8)
```  
**媒体查询中使用的逻辑关键词**  
and 连接两个或多个媒体特性必须同时满足条件，整个查询得到的结果才是真值  
例如：  
```css
(color) and (oruentation:landscape) and (min-device-width:800px)
```  
表示三个条件都要满足：当媒体环境是彩色的、横向放着，而且设备的屏幕宽至少为800像素，才会应用样式表。  
not 对整个查询取反。  
例如：
```css
not (color) and (oruentation:landscape) and (min-device-width:800px)
```  
表示三个条件都要满足，整个语句得到的结果与之相反。因此，当媒体环境是彩色的、横向放着，而且设备的屏幕宽至少为800像素，样式表不会应用到文档上。除此之外的情况下，都应用样式表。  

**注意：**  
not关键字只能在媒体查询的开头使用。  
only 在不支持媒体查询的旧浏览器中隐藏样式表。  


## 第二章  
**元素选择符**  
```css
h1{color:black;}
```  
所有h1元素的颜色都为black;   
属性值含有多个关键字，中间用空格分开
```css
p{font:medium  Helvetica;}
```  
特例：font属性的值有一处要使用斜线（/）把两个关键字隔开。  
```css
h2 {font:large/150% sans-serif;}
```  
这个斜线把设定元素字号和行高的两个关键字分开。  

**群组选择符**  
```css
h2,p{color:gray;}
```  
h2元素和段落中的文本都显示为灰色
```css
h1,h2,h3,h4,h5,h6{color:purple;}
```  

**通用选择符**  
```css
*{color:red;}
```  
文档中的每个元素都显示为红色。  

**群组声明**  
```css
h1{
    font:18px;
    color:purple;
    background:aqua;
}
```  
**群组选择符与群组声明结合**  
```css
h1,h2,h3,h4,h5,h6{
    font:18px;
    color:purple;
    background:aqua;
}
```  
**类选择符.**  
为设定了class属性的元素赋予样式，在class属性的值前加上点号(.)
```css
.warning{font-weight:blod;}
p.warning{font-weight:blod;}
```  
这个选择符现在匹配class属性的值中包含warning的p元素  

**多个类**  
    假如你想让class属性的值为warning的元素显示为粗体，值为urgent的元素显示为斜体，而同时拥有二者的元素具有银色背景，可以这样写：  
```css
.warning{font-weight:bold;}
.urgent{font-style:italic;}
.warning.urgent{background:silver;}
```  
下面这个选择符匹配的是class属性中同时包含warning和help的p元素。
```css
p.warning.help{background:red;}
```  

**ID选择符#**  
```css
#lead-para{font-weight:bold;}
```  
```css
#mostImportant{color:red;background:yellow;}
```  

**属性选择符**  
例如：若想选择具有class属性（可以包含任何值）的所有h1元素，把文本设为银色，可以这样写  
```css
h1[class]{color:silver;}
```  

**多个属性选择**  
例如：若想让同事具有href和title属性的HTML超链接显示为粗体，可以这样写  
```css
a[href][title]{font-weight:bold;}
```  

**精准的属性值选择**  
例如：只想选择moons属性的值为1的planet元素，可以这样写  
```css
planet[moons="1"]{font-weight:blod;}
```  
例如：若想把href属性的值为http://www.baidu.com，而且title属性的值为baidu的HTML超链接显示为两倍字号，如下  
```css
a[href="http://www.baidu.com"][title="baidu"]{font-size:200%;}
```  

**部分属性值选择**  
[foo|="bar"] 选择的元素有foo属性，且其值以bar和一个英文破折号开头，或者其值就是bar本身  
[fool~="bar"] 选择的元素有foo属性，且其值是包含bar这个词的一组词  
[fool*="bar"] 选择的元素有foo属性，且其值包含子串bar  
[fool^="bar"] 选择的元素有foo属性，且其值以bar开头  
[fool$="bar"] 选择的元素有foo属性，且其值以bar结尾  

举例  
[foo|="bar"]  
选择lang属性的值为en或者以en-开头的元素  
```css
[lang|="en"]{color:white;}
```  
```html
<h1 lang="en">hello!</h1>
<p lang="en-us">hi</p>
<div lang="en-au">G`day!</div>
<p lang="fr">boy</p>
<h4 lang="cy-en">good</h4>
```  
前三个元素会被选中，后两个元素不会被选中  

```css
[fool~="bar"]
```
倾斜class属性中包含barren这个词的所有元素  
```html
<span class="barren">lily</span>
<span class="cloudy barren">lucy</span>
<span class="cloudy">lucky</span>
```
```css
span[class~="barren"]{font-style:italic;}
```
前两个元素倾斜，最后一个元素不倾斜  

[fool*="bar"]  
```html
<span class="barren rocky">mercury</span>
<span class="cloudy barren">venus</span>
<span class="life-bearing cloudy">earth</span>
```
```css
span[class*="cloud"]{font-style:italic;}
```
第一个元素不倾斜，后两个元素倾斜  

**不区分大小写标识符 i**  
```css
a[href$='.PDF' i]
```
匹配href属性的值以.pdf结尾的任何a元素，不管P、D和F这三个字母的大小写。  


### 父子关系
**后代选择符**  
```css
h1 em{color:gray;}
```
作为h1元素后代的em元素中的文本显示为灰色；  
后代选择符中不止可以使用两个单独的选择符  
```css
ul ol ul em{color:gray;}
```
一个无序列表中的有序列表中的无序列表中的强调文字显示为灰色。  

把blockquote中的b元素和常规段落中的b元素都显示为灰色  
```css
blockquote b,p b{color:gray;}
```
后代选择符对元素的距离一无所知  

**子代选择符>**  
把第一个h1中的strong元素显示为红色，第二个不受影响。  
```html
<h1>this is<strong>very</strong>important.</h1>
<h1>this is<em>really<strong>very</strong></em>important.</h1>
```
```css
h1>strong{color:red;}
```

**紧邻同胞连结符+**  
若想把紧跟在h1元素后面的段落的上外边距去掉，这样写：
```css
h1+p{margin-top:1;}
```

**同胞连结符～**  
选择一个元素后面同属一个父元素的另一个元素。  

### 伪类选择符  
**拼接伪类**  
```css
a:link:hover{color:red;}
```

**结构伪类（：）**  
选择根元素  
```css
:root{border:10px dotted gray;}
```
选择空元素  
```css
p:empty{display:none;}
```
选择唯一的子代  
```css
img:only-child{border:1px solid black;}
```
```css
a [href] img:only-child {border:2px solid black;}
```

**伪类:only-of-type 和 :only-child区别：**  
:only-of-type 匹配同胞中唯一的那种元素；:only-of-type 指代的是元素  
:only-child 只匹配完全没有同胞的元素。  
```css
p.unique:only-of-type{color:red;}
```
选择的 p 元素的 class 属性中包含 unique 这个词，而且 p 元素是同胞中唯一的一个。  

**选择第一个和最后一个子代**  
:first-child 伪类选择一个元素的第一个子元素  
把第一个p元素显示为粗体。  
```css
p:first-child{font-weight:bold;}
```
:last-child 伪类选择一个元素的最后一个子元素。  
把一个元素中的最后一个p元素显示为粗体。  
```css
p:last-child{font-weight:bold;}
```
:only-child 伪类选择一个元素的唯一的子元素  
:first-of-type 选择一个元素中某种元素的第一个；  
:last-of-type 选择一个元素中某种元素的最后一个。  
```css
table:first-of-type {border-top:2px solid gray;}
```
选择里面有表格的元素中的第一个table  

选择每第n个子元素:nth-child()  
选择每第n个某种元素:nth-last-child()  

**区分:first-child 和 :first-of-type**  
```html
<div>
    <p>第一个子元素</p>
    <h1>第二个子元素</h1>
    <span>第三个子元素</span>
    <span>第四个子元素</span>
</div>
```
|举例|解释|
|:----|:----|
|p:first-child|匹配到的是p元素,因为p元素是div的第一个子元素；|
|h1:first-child|匹配不到任何元素，因为在这里h1是div的第二个子元素，而不是第一个；|
|span:first-child|匹配不到任何元素，因为在这里两个span元素都不是div的第一个子元素；|
|p:first-of-type|匹配到的是p元素,因为p是div的所有类型为p的子元素中的第一个；|
|h1:first-of-type|匹配到的是h1元素，因为h1是div的所有类型为h1的子元素中的第一个；|
|span:first-of-type|匹配到的是第三个子元素span。这里div有两个为span的子元素，匹配到的是它们中的第一个。|

所以，通过以上可以得出结论：  
:first-child 匹配的是某父元素的第一个子元素，可以说是结构上的第一个子元素。  
:first-of-type 匹配的是某父元素下相同类型子元素中的第一个，比如 p:first-of-type，就是指所有类型为p的子元素中的第一个。这里不再限制是第一个子元素了，只要是该类型元素的第一个就行了。  
同样类型的选择器 :last-child  和 :last-of-type、:nth-child(n)  和  :nth-of-type(n) 也可以这样去理解。  

**动态伪类**  
|伪类|说明|
|:----|:----|
|:link|指代用做超链接的锚记（即具有href属性），而且指向尚未访问的地址|
|:visited|指代指向已访问地址的超链接。出于安全考虑，能应用到已访问连接上的样式十分有限。|

**用户操作伪类**  
|伪类|说明|
|:----|:----|
|:focus|指代当前获得输入焦点的元素，即可以接受键盘输入或以某种方式激活|
|:hover|指代鼠标指针放置其上的元素，例如鼠标指针悬停在超链接上|
|:active|指代由用户输入激活的元素，例如用户单击超链接时按下鼠标按键的那段时间|

这些伪类的顺序不是随意的，link-visited-focus-hover-active  

举个例子
```css
body*:hover{background:yellow;}
```
这个规则把body的任何后代元素处于悬停状态时的背景设为黄色。  

**UI状态伪类**  
|伪类|说明|
|---|---|
|:enabled|指代启用的用户界面元素（例如表单元素），即接受输入的元素|
|:disabled|指代紧用的用户界面元素（例如表单元素），即不接受输入的元素|
|:checked|指代由用户或文档默认选中的单选按钮或复选框|
|:indeterminate|指代既未选中也没有未选中的单选按钮或复选框；这个状态只能由DOM脚本设定，不能由用户设定|
|:default|指代默认选中的单选按钮、复选框或选项|
|:valid|指代满足所有数据有效性语义的输入框|
|:invalid|指代不满足所有数据有效性语义的输入框|
|:in-range|指代输入的值在最小值和最大值之间的输入框|
|:out-of-range|只在输入的值小于控件允许的最小值或大于控件允许的最大值的输入框|
|:required|指代必须输入值的输入框|
|:optional|指代无需一定输入值的输入框|
|:read-write|指代可由用户编辑的输入框|
|:read-only|指代不能由用户编辑的输入框|

**:target伪类**  
:target伪类可以突出显示文档中的任何目标元素，或者为不同的目标元素定义不同的样式  

:target伪类定义的样式在两种情况下不会应用：  
1.页面的URL中没有片段标识符。  
2.页面的URL中有片段标识符，但是文档中没有与之匹配的元素。  

**:lang伪类**  
:lang伪类可以根据文本使用的语言选择元素，在匹配方式上，:lang()伪类与 |= 属性选择符类似  
```css
*:lang(fr){font-style:italic;}
*[lang|="fr"]{font-style:italic;}
```
如果想让使用法语编写的元素倾斜，以上两种编写方法均可。  

伪类选择符与属性选择符的主要区别是语言信息有多个来源，又是可能来自元素自身之外。对属性选择符来说，元素自身必须有lang属性才能匹配。而:lang伪类能匹配设定了语言的元素的后代。  

:lang伪类可以使用各种信息，而 |= 属性选择符只能用于标记中有lang属性的元素。因此，伪类比属性选择符更可靠。  

**否定伪类:not()**  
```css
.moreinfo:not(li){font-style:italic;}
```
这个选择符的意思是：选择的元素，其class属性中包含moreinfo这个词，但不是li元素。  
```css
li:not(.moreinfo){font-style:italic;}
```
这个选择符的意思是，选择li元素，但不包括class属性中包含moreinfo这个词的li元素。  
否定伪类不能嵌套，但否定伪类可以穿在一起。  
```css
*.link:not(li):not(p){font-style:italic;}
```
这个规则的意思是，选择class属性值这种包含link这个词，但不是li或p元素。  

**伪元素选择符::**  
::first-letter 伪元素用于装饰任何非行内元素的首字母，或者开头的标点符号和首字母。常用于实现排版效果中的“首字母大写”或“首字母下沉”。  
::first-line 用于装饰元素的首行文本。  

::first-letter 和::first-line 伪元素只能应用到块级元素上，例如标题或段落，不能应用到行内元素上。  

::before 装饰前置内容元素  
::after 装饰后置内容元素  