﻿// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// TABLES
Microsoft.Tables = Microsoft.Tables || {};
Microsoft.Tables = {
    MAX_NUMBER_ITEMS_PER_PAGE: 10,
    view_tag_id: "#search-results-content",

    render_table_result: function (docresult, target_tag_id) {
        var resultsHtml = '';

        Microsoft.Search.results_keys_index.push(docresult.index_key);
        docresult.idx = Microsoft.Search.results_keys_index.length - 1;

        var name = docresult.document_filename;
        var path = docresult.metadata_storage_path;
        var pathLower = path.toLowerCase();
        var pathExtension = pathLower.split('.').pop();

        if (path !== null) {

            resultsHtml += '<div class="row results-cluster-row border-top border-3 border-secondary mt-1">';
            resultsHtml += '<div class="col-md-2">';

            resultsHtml += '<div class="row">';
            var iconPath = Microsoft.Utils.GetIconPathFromExtension(pathExtension);

            resultsHtml += '<a href="javascript:void(0)" onclick="Microsoft.Results.Details.ShowDocumentById(\'' + docresult.document_id + '\');" >';

            if (Microsoft.Utils.images_extensions.includes(pathExtension)) {
                if (docresult.image) {
                    resultsHtml += '<img alt="' + name + '" class="image-result" src="data:image/png;base64, ' + docresult.image.thumbnail_medium + '" title="' + docresult.metadata_storage_name + '" />';
                }
            }
            else {
                resultsHtml += Microsoft.Search.RenderCoverImage(docresult,name,iconPath);
            }

            resultsHtml += '</a>';
            resultsHtml += '</div>';

            resultsHtml += Microsoft.Search.Actions.renderActions(docresult, true, null, true);
            resultsHtml += '</div>';

            // Tables list 
            var table_zone_id = docresult.index_key + "-tables";
            resultsHtml += '<div id="' + table_zone_id + '" class="col-md-10" >'

            // Add the document name here + last modific
            resultsHtml += Microsoft.Utils.GetDocumentTitle(docresult);
            resultsHtml += Microsoft.Utils.GetModificationLine(docresult);

            $(target_tag_id).append(resultsHtml);

            this.render_document_datatables(docresult, '#'+table_zone_id);

            $(target_tag_id).append('</div>');
        }   
    },
    
    render_document_tables: function (docresult, tabular, target_tag_id) {
        this.render_document_datatables(docresult, target_tag_id);
    },
    
    render_document_datatables: function (docresult, target_tag_id='#tables-viewer') {

        if (docresult.tables && docresult.tables.length > 0) {

            var tables = docresult.tables;

            // for each table 
            for (var i = 0; i < tables.length; i++) {
                var table = JSON.parse(tables[i]);

                var extraMetadataContainerHTML = '';

                var table_id = docresult.index_key + i;

                if (docresult.document.translated) {
                    extraMetadataContainerHTML += '<div class="container mt-2 border-start border-2 border-warning" style="overflow-x:auto;">';
                }
                else {
                    extraMetadataContainerHTML += '<div class="container mt-2 border-start border-2 border-primary" style="overflow-x:auto;">';
                }

                extraMetadataContainerHTML += '<table id=' + table_id + ' class="table table-hover table-striped">';
                extraMetadataContainerHTML += '<thead>';

                var table_matrix = Array.from(Array(table.row_count), () => new Array(table.column_count));

                var headers_row_indexes = [];

                // fill up a matrix of cells
                for (var j = 0; j < table.cells.length; j++) {
                    var cell = table.cells[j];
                    table_matrix[cell.rowIndex][cell.colIndex] = cell;
                    if (cell.is_header) {
                        // Row index is an header row
                        if (!headers_row_indexes.includes(cell.rowIndex)) {
                            headers_row_indexes.push(cell.rowIndex);
                        }
                    }
                }

                // Process the headers
                if (headers_row_indexes.length > 0) {
                    for (var k = 0; k < headers_row_indexes.length; k++) {
                        var row = table_matrix[headers_row_indexes[k]];
                        extraMetadataContainerHTML += '<tr>';
                        for (var j = 0; j < table.column_count; j++) {
                            cell = row[j];
                            if (cell && cell.text) {
                                extraMetadataContainerHTML += '<th>' + cell.text + '</th>';
                            }
                            else {
                                extraMetadataContainerHTML += '<th></th>';
                            }
                        }
                        extraMetadataContainerHTML += '</tr>';
                    }
    
                }
                else {
                    extraMetadataContainerHTML += '<tr>';
                    for (let index = 0; index < table.column_count; index++) {
                        extraMetadataContainerHTML += '<th></th>';                        
                    }
                    extraMetadataContainerHTML += '</tr>';
                }

                extraMetadataContainerHTML += '</thead>';
                extraMetadataContainerHTML += '<tbody>';

                // for each row (excl header row)
                for (var k = 0; k < table.row_count; k++) {
                    if (!headers_row_indexes.includes(k)) {
                        var row = table_matrix[k];
                        extraMetadataContainerHTML += '<tr>';

                        for (var j = 0; j < table.column_count; j++) {
                            cell = row[j];
                            var colSpan = 1;
                            if (cell && cell.text) {
                                // if (cell.colSpan) {
                                //     colSpan=cell.colSpan
                                // }
                                extraMetadataContainerHTML += '<td colspan="'+colSpan+'">' + cell.text + '</th>';
                            }
                            else {
                                extraMetadataContainerHTML += '<td colspan="'+colSpan+'"></td>';
                            }
                        }

                        // for (var j = 0; j < table.column_count; j++) {
                        //     cell = row[j];
                        //     if (cell && cell.text) {
                        //         extraMetadataContainerHTML += '<td>' + cell.text + '</td>';
                        //     }
                        //     else {
                        //         extraMetadataContainerHTML += '<td></td>';
                        //     }
                        // }
                        extraMetadataContainerHTML += '</tr>';
                    }
                }

                extraMetadataContainerHTML += '</tbody>';

                extraMetadataContainerHTML += '</table>';

                extraMetadataContainerHTML += '</div><br/>';

                // Table Chat
                extraMetadataContainerHTML += '<div id="' + table_id + '-chat" >';
                extraMetadataContainerHTML += '<div id="' + table_id + '-chat-content-chat-prompt-content" class="d-none">';
                //TODO convert table matrix to CSV Format
                var csvformat = '';
                for (var l = 0; l < table_matrix.length; l++) {
                    csvformat += '|';
                    for (var k = 0; k < table_matrix[l].length; k++) {
                        if (table_matrix[l][k] && table_matrix[l][k].text) {
                            csvformat += table_matrix[l][k].text + '|';
                        }
                        else {
                            csvformat += ' |';
                        }
                    }
                    csvformat += '\n';
                }
                extraMetadataContainerHTML += csvformat;
                extraMetadataContainerHTML += '</div>';

                extraMetadataContainerHTML += '<div id="' + table_id + '-chat-content" >';
                extraMetadataContainerHTML += '</div>';
                extraMetadataContainerHTML += '</div>';

                $(target_tag_id).append(extraMetadataContainerHTML);

                var table = $('#' + table_id).DataTable({
                    dom: 'Bfrtip',
                    paging: false,
                    ordering: false,
                    info: false,
                    responsive:true,
                    buttons: ['copyHtml5', 'csvHtml5', 'excelHtml5', 'pdfHtml5', 'spacer', 'print'],
                    // buttons: [
                    // ],
                    searching: false
                });

                table.buttons().container().appendTo('#' + table_id + '_wrapper .col-md-6:eq(0)');

                Microsoft.Search.Results.Chat.render_chat_view(table_id+"-chat-content","Ask your table anything...","TableChat");
            }

            if (tables.length > 0) {
                $('#tables-pivot-link').html('<span class="bi bi-table"></span> Tables (' + tables.length + ')');
            }
            else {
                $('#tables-pivot-link').hide();
            }
        }
        else {
            $('#tables-pivot-link').hide();
        }
    },

    TablesSearch: function (query) {

        if (Microsoft.Search.setQueryInProgress()) {

            if (query !== undefined && query !== null) {
                $("#q").val(query)
            }

            if (Microsoft.Search.currentPage > 0) {
                if (Microsoft.View.currentQuery !== $("#q").val()) {
                    Microsoft.Search.ResetSearch();
                }
            }
            Microsoft.View.currentQuery = $("#q").val();

            var rendering_filter = Microsoft.View.config.filter ? Microsoft.View.config.filter : '';

            if (Microsoft.Search.results_rendering > -1) {
                if (Microsoft.View.config.resultsRenderings[Microsoft.Search.results_rendering].filter) {
                    if (rendering_filter.length > 0) {
                        rendering_filter += ' and ';
                    }
                    rendering_filter += Microsoft.View.config.resultsRenderings[Microsoft.Search.results_rendering].filter;
                }
            }

            $.postAPIJSON('/api/search/getdocuments',
                {
                    queryText: Microsoft.View.currentQuery !== undefined ? Microsoft.View.currentQuery : "*",
                    searchFacets: Microsoft.Facets.selectedFacets,
                    currentPage: ++Microsoft.Search.currentPage,
                    parameters: Microsoft.Search.Parameters,
                    options: Microsoft.Search.Options,
                    incomingFilter: rendering_filter
                },
                function (data) {
                    Microsoft.Tables.TablesUpdate(data, Microsoft.Search.currentPage);
                });
        }
    },

    TablesUpdate: function(data, currentPage) {

        Microsoft.Search.ProcessSearchResponse(data,this.MAX_NUMBER_ITEMS_PER_PAGE); 

        // TABLES
        Microsoft.Tables.UpdateTablesResults(Microsoft.Search.results, currentPage);
    
    },
    
    UpdateTablesResults: function(results, currentPage) {

        if (currentPage === 1) {
            $(Microsoft.Tables.view_tag_id).empty();
        }

        if (results && results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                var docresult = results[i].Document !== undefined ? results[i].Document : results[i];
                Microsoft.Tables.render_table_result(docresult, Microsoft.Tables.view_tag_id);
            }
        }

        return '';
    }
}

// export default Microsoft.Tables;