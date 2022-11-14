using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLexicon.Services.Migrations
{
    public partial class mess4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "ForumCategories",
                keyColumn: "Id",
                keyValue: 1,
                column: "Created",
                value: new DateTime(2022, 11, 12, 11, 6, 8, 104, DateTimeKind.Local).AddTicks(3790));

            migrationBuilder.UpdateData(
                table: "ForumCategories",
                keyColumn: "Id",
                keyValue: 2,
                column: "Created",
                value: new DateTime(2022, 11, 12, 11, 6, 8, 104, DateTimeKind.Local).AddTicks(3810));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "ForumCategories",
                keyColumn: "Id",
                keyValue: 1,
                column: "Created",
                value: new DateTime(2022, 11, 12, 0, 15, 16, 522, DateTimeKind.Local).AddTicks(8550));

            migrationBuilder.UpdateData(
                table: "ForumCategories",
                keyColumn: "Id",
                keyValue: 2,
                column: "Created",
                value: new DateTime(2022, 11, 12, 0, 15, 16, 522, DateTimeKind.Local).AddTicks(8590));
        }
    }
}
