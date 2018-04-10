(function($, window) {
	// 初始态定义
	var reportCollections = {};

	// 插件定义
	$.fn.ReportTable = function(config) {
		// 默认参数，可被重写
		var defaults = {
			ajax: {
				type: 'get',
				data: null
			}
		};

		var self = this,
		//table DOM对象
			table = $(this[0]);
		// 插件配置参数
		this.params = $.extend(defaults, config);

		/*初始化函数*/
		var init = function() {
			if(reportCollections) {
				// 对于已初始化的处理
			}
			// 初始化弹出框数据
			initData();
			// 加载内容
			loadContent();
			// 事件绑定
			loadEvent();
		}

		/*数据加载*/
		var initData = function() {
			if(!self.params.ajax || !self.params.ajax.url) {
				alert('请提供数据源！');
				return;
			}
			var ajax = self.params.ajax;
			$.ajax({
				url: ajax.url,
				data: ajax.data,
				type: ajax.type,
				dataType: 'json',
				async: false,
				success: function(data) {
					self.params.total = data.data.total;
					if(data.code == 1) {
						self.params.data = data.data.rows;
					} else {
						alert('数据加载失败！')
					}
				},
				error: function() {
					alert('数据加载失败！')
				}
			})
		}

		/*事件绑定*/
		var loadEvent = function() {

		}

		/*模板生成*/
		var loadContent = function() {
			if(!self.params.title) {
				alert('数据关联标识不能缺少！');
				return;
			}
			if(!self.params.data) {
				alert('请提供数据源！');
				return;
			}
			//生成table头部
			var title = self.params.title;
			table.append('<thead><tr></tr></thead><tbody></tbody>');
			for(var i = 0; i < title.length; i++) {
				table.find('thead tr:first').append('<th>' + title[i].name + '</th>');
			}
			//渲染数据
			var data = self.params.data;
			//暂无数据
			if(data.length <= 0) {
				table.find("tbody").append('<tr><td colspan="' + title.length + '">暂无数据</td></tr>');
				return;
			}
			for(var i = 0; i < data.length; i++) {
				var tr = $('<tr></tr>');
				for(var ii = 0; ii < title.length; ii++) {
					var width = '',
						className = '';
					if(title[ii].width) {
						width = ' style="width:' + title[ii].width + 'px"';
					}
					if(title[ii].className) {
						className = ' class="' + title[ii].className + '"';
					}
					if(title[ii].data == 'xh') {
						var order = (self.params.ajax.data.page - 1) * self.params.ajax.data.rows + i + 1;
						tr.append('<td' + width + className + '>' + order + '</td>');
						continue;
					}
					if(data[i][title[ii].data] === undefined) {
						//console.log('第' + i + '行数据缺少字段' + title[ii].data);
					}
					if(title[ii].render) {
						tr.append('<td' + width + className + '>' + title[ii].render((data[i][title[ii].data] || '')) + '</td>');
					} else {
						tr.append('<td' + width + className + '>' + (data[i][title[ii].data] || '') + '</td>');
					}
				}
				table.find("tbody").append(tr);
			}
			//分页条件
			if(self.params.ajax.data.page && self.params.ajax.data.rows) {
				paging();
			}

			//合并单元格条件
			if(self.params.cols) {
				initMerge(self.params.cols, self.params.colsDpdOn);
			}
		}

		/*分页按钮省略计算*/
		var _range = function(len, start) {
			var out = [];
			var end;
			if(start === undefined) {
				start = 0;
				end = len;
			} else {
				end = start;
				start = len;
			}
			for(var i = start; i < end; i++) {
				out.push(i);
			}
			return out;
		};

		var _numbers = function(page, pages) {
			var numbers = [],
				buttons = 7,
				half = Math.floor(buttons / 2),
				i = 1;
			if(pages <= buttons) {
				numbers = _range(0, pages);
			} else if(page <= half) {
				numbers = _range(0, buttons - 2);
				numbers.push('ellipsis');
				numbers.push(pages - 1);
			} else if(page >= pages - 1 - half) {
				numbers = _range(pages - (buttons - 2), pages);
				numbers.splice(0, 0, 'ellipsis'); // no unshift in ie6
				numbers.splice(0, 0, 0);
			} else {
				numbers = _range(page - half + 2, page + half - 1);
				numbers.push('ellipsis');
				numbers.push(pages - 1);
				numbers.splice(0, 0, 'ellipsis');
				numbers.splice(0, 0, 0);
			}
			return numbers;
		}

		/*分页函数*/
		var paging = function() {
			var rows = self.params.ajax.data.rows,
				page = self.params.ajax.data.page,
				totalpage = parseInt(self.params.total / rows) + 1,
				arr = _numbers(page - 1, totalpage),
				html = '<div class="page-wrap">' +
					'<div class="page-info">' +
					'第 <span class="page-current">' + page + '</span> 页  / 共 <span class="page-total">' + totalpage + '</span> 页' +
					'<span class="page-length"> , 每页 <input type="type" value="' + rows + '" maxlength="3"> 条</span>' +
					'</div>' +
					'<div class="page-button">' +
					'<a href="javascript:;" class="prev-page">上页</a>' +
					'<span class="paginate">';
			for(var i = 0; i < arr.length; i++) {
				if(arr[i] == (page - 1)) {
					html += '<a href="javascript:;" class="current">' + (arr[i] + 1) + '</a>';
				} else if(arr[i] == 'ellipsis') {
					html += '<span class="ellipsis">&#x2026;</span>';
				} else {
					html += '<a href="javascript:;">' + (arr[i] + 1) + '</a>';
				}
			}
			html += '</span><a href="javascript:;" class="next-page">下页</a></div></div>';
			table.after(html);

			//点击页数
			$('.paginate a').on('click', function() {
				self.params.ajax.data.page = $(this).text();
				self.reload();
			});

			//上页
			$('.page-button .prev-page').on('click', function() {
				if(self.params.ajax.data.page <= 1) return;
				self.params.ajax.data.page--;
				self.reload();
			});

			//下页
			$('.page-button .next-page').on('click', function() {
				if(self.params.ajax.data.page >= totalpage) return;
				self.params.ajax.data.page++;
				self.reload();
			});

			//一页多少条
			$('.page-length input').on('keypress', function(e) {
				if(e.keyCode == 13) {
					self.params.ajax.data.rows = $(this).val();
					self.reload();
				}
			})
			//只能输入正整数
			$('.page-length input').on('keyup', function() {
				if(this.value.length == 1) {
					this.value = this.value.replace(/[^1-9]/g, '')
				} else {
					this.value = this.value.replace(/\D/g, '')
				}
			})
		};

		/*合并单元格初始化函数*/
		var initMerge = function(colsArr, colsDpdOn) {
			var cols = colsArr;
			for(var i = cols.length - 1; cols[i] >= 0; i--) {
				mergeCell(table, cols[i], colsDpdOn);
			}
			dispose(table);
		};

		/*合并单元格实现函数*/
		var mergeCell = function($table, colIndex, colsDpdOn) {
			$table.data('col-content', ''); // 存放单元格内容
			$table.data('col-dpd-content', ''); // 存放依赖单元格内容
			$table.data('col-rowspan', 1); // 存放计算的rowspan值 默认为1
			$table.data('col-td', $()); // 存放发现的第一个与前一行比较结果不同td(jQuery封装过的), 默认一个"空"的jquery对象
			$table.data('trNum', $('tbody tr', $table).length); // 要处理表格的总行数, 用于最后一行做特殊处理时进行判断之用
			// 我们对每一行数据进行"扫面"处理 关键是定位col-td, 和其对应的rowspan
			$('tbody tr', $table).each(function(index) {
				var _this = $(this);
				// td:eq中的colIndex即列索引
				var $td = $('td:eq(' + colIndex + ')', this);
				// 取出单元格的当前内容
				var currentContent = $td.html();

				// 是否存在合并依赖列
				var hasDependOn = !!colsDpdOn;
				// 合并依赖列的内容
				var dependOnContent;
				if(hasDependOn){
					// 合并依赖列的索引
					var $tdDpdOn = $('td:eq(' + colsDpdOn + ')', this);
					// 取出依赖列单元格的当前内容
					dependOnContent = $tdDpdOn.html();
				}
				// 第一次时走此分支
				if($table.data('col-content') == '') {
					$table.data('col-content', currentContent);
					$table.data('col-td', $td);
					$table.data('col-dpd-content', dependOnContent);
				} else {
					// 上一行与当前行的合并列内容相同，并且合并依赖列的内容也相同
					if($table.data('col-content') == currentContent && (!hasDependOn || hasDependOn && $table.data('col-dpd-content') == dependOnContent)) {
						// 上一行与当前行内容相同则col-rowspan累加, 保存新值
						var rowspan = $table.data('col-rowspan') + 1;
						$table.data('col-rowspan', rowspan);
						// 值得注意的是 如果用了$td.remove()就会对其他列的处理造成影响
						$td.hide();
						// 最后一行的情况比较特殊一点
						// 比如最后2行 td中的内容是一样的, 那么到最后一行就应该把此时的col-td里保存的td设置rowspan
						if(++index == $table.data('trNum')){
							$table.data('col-td').attr('rowspan', $table.data('col-rowspan'));
						}
					} else { // 上一行与当前行内容不同
						// col-rowspan默认为1, 如果统计出的col-rowspan没有变化, 不处理
						if($table.data('col-rowspan') != 1) {
							$table.data('col-td').attr('rowspan', $table.data('col-rowspan'));
						}
						// 保存第一次出现不同内容的td, 和其内容, 重置col-rowspan
						$table.data('col-td', $td);
						$table.data('col-content', $td.html());
						$table.data('col-rowspan', 1);
						$table.data('col-dpd-content', dependOnContent);
					}
				}
			})
		}

		// private函数 清理内存之用
		var dispose = function($table) {
			$table.removeData();
		}

		/*清理*/
		var clear = function() {
			table.html('');
			$('.page-wrap').remove();
		}

		/*重载*/
		this.reload = function() {
			clear();
			initData();
			loadContent();
		}

		/*内部使用参数*/
		var eventAlias = {

		};

		/*提供外部函数*/
		this.close = function() {
			clear();
		}

		// 启动插件
		init();

		// 链式调用
		return this;
	};
	// 插件结束
})(jQuery, window);